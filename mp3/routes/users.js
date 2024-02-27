var Task = require( '../models/task' );
var User = require( '../models/user' );
const { formatResponse } = require( './helper' );

module.exports = function( router ){
    // All users -> GET, POST
    // GET
    router.route( '/users' ).get( async( req, res ) => {
        try {
            let query = User.find();

            if( req.query.where )
                query = query.where( JSON.parse( req.query.where ) );
            if( req.query.sort )
                query = query.sort( JSON.parse( req.query.sort ) );
            if( req.query.select )
                query = query.select( JSON.parse( req.query.select ) );
            if( req.query.skip )
                query = query.skip( Number( req.query.skip ) );
            if( req.query.limit )
                query = query.limit( Number( req.query.limit ) );
        
            if( req.query.count == 'true' ){
                const count = await User.countDocuments( query.getFilter() );
                return res.status( 200 ).send( formatResponse( "Count for users", { count } ) );
            }

            const users = await query.exec();
            return res.status( 200 ).send( formatResponse( "Users list retrieved successfully", users ) );
        } catch( error ) {
            return res.status( 500 ).send( formatResponse( "Error retrieving user list", error ) );
        }
    });

    // POST
    router.route( '/users' ).post( async( req, res ) => {
        // console.log( "post request" );
        // console.log( "req.body: " );
        // console.log( req.body );
        try{
            // check name attribute
            if( !req.body.name )
                return res.status( 400 ).send( formatResponse( "Name required", {} ) );

            // check email attribute
            if( !req.body.email )
               return res.status( 400 ).send( formatResponse( "Email required", {} ) );

            // console.log( "email = ", req.body.email )
            const existingUser = await User.findOne( { email: req.body.email } ).exec();
            console.log( "existing user = ", existingUser );
            if( existingUser )
                return res.status( 409 ).send( formatResponse( "Email already exist", {} ) );
            
            let user = new User( req.body );
            
            if( req.body.pendingTasks && req.body.pendingTasks.length > 0 ){
                const tasks = await Promise.all( req.body.pendingTasks.map( id => Task.findById( id ).exec() ) );
                user.pendingTasks = tasks.filter( task => task != null ).map( task => task.id );
            }
            await user.save();

            if( user.pendingTasks && user.pendingTasks.length > 0 ){
                await Promise.all( user.pendingTasks.map( async taskId => {
                    const task = await Task.findById( taskId );
                    if( task ){
                        task.assignedUser = user.id;
                        task.assignedUserName = user.name;
                        await task.save();
                    }
                }));
            }
            res.status( 201 ).send( formatResponse( "User created successfully", user ) );
            // console.log( "send successful response" );
        } catch( error ) {
            // console.log( "error = ", error );
            res.status( 500 ).send( formatResponse( "Error creating user", error ) ); // internal server error
            // console.log( "send error response" );
        }
    });

    // One user -> GET, PUT, DELETE
    // GET
    router.route( '/users/:id' ).get( async( req, res ) => {
        try {
            const user = await User.findById( req.params.id );
            if( !user )
                return res.status( 404 ).send( formatResponse( "User not found", {} ) );
            res.status( 200 ).send( formatResponse( "User retrieved successfully", user ) );
        } catch( error ){
            res.status( 500 ).send( formatResponse( "Error retrieving user", error ) );
        }
    });

    // PUT
    router.route( '/users/:id' ).put( async( req, res ) => {
        try {
            if( req.body.email ){
                const existingUser = await User.findOne( { email: req.body.email, _id: { $ne: req.params.id } } ).exec();
                if( existingUser )
                    return res.status( 400 ).send( formatResponse( "Email already exist" ) );
            }

            const user = await User.findByIdAndUpdate( req.params.id, req.body, { new: true, overwrite: true } );
            if( !user )
                return res.status( 404 ).send( formatResponse( "User not found", {} ) );

            if( req.body.pendingTasks ){
                await Task.updateMany( { assignedUser: req.params.id }, { assignedUser: "", assignedUserName: "unassigned" } );
                await Task.updateMany( { _id: { $in: req.body.pendingTasks } }, { assignedUser: req.params.id, assignedUserName: user.name } );
            }
            res.status( 200 ).send( formatResponse( "User updated successfully", user ) );
        } catch( error ) {
            res.status( 500 ).send( formatResponse( "Error updating user", error ) );
        }
    });

    // DELETE
    router.route( '/users/:id' ).delete( async ( req, res ) => {
        try {
            const user = await User.findByIdAndRemove( req.params.id );
            if( !user )
                return res.status( 404 ).send( formatResponse( "User not found", {} ) );

            await Task.updateMany( { assignedUser: user.id }, { assignedUser: "", assignedUserName: "unassigned" } );
            
            res.status( 200 ).send( formatResponse( "User deleted successfully", {} ) );
        } catch( error ) {
            res.status( 500 ).send( formatResponse( "Error deleting user", error ) );
        }
    });

    return router;
}
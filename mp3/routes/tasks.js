var Task = require( '../models/task' );
var User = require( '../models/user' );
const { formatResponse } = require( './helper' );

module.exports = function( router ){
    // All tasks -> GET, POST
    // GET
    router.route( '/tasks' ).get( async( req, res ) => {
        try {
            let query = Task.find();

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
                const count = await Task.countDocuments( query.getFilter() );
                return res.status( 200 ).send( formatResponse( "Count for tasks", { count } ) );
            }

            const tasks = await query.exec();
            res.status( 200 ).send( formatResponse( "Tasks list retrieved successfully", tasks ) );
        } catch( error ) {
            res.status( 500 ).send( formatResponse( "Error retrieving task list", error ) );
        }
    });

    // POST
    router.route( '/tasks' ).post( async( req, res ) => {
        try{
            // check name attribute
            if( !req.body.name )
                return res.status( 400 ).send( formatResponse( "Name required", {} ) );

            // check deadline attribute
            if( !req.body.deadline )
                return res.status( 400 ).send( formatResponse( "Deadline required", {} ) );
            
            let task = new Task( {
                name: req.body.name,
                description: req.body.description || "",
                deadline: req.body.deadline,
                completed: req.body.completed || false,
                assignedUser: "",
                assignedUserName: "unassigned"                
            } );

            if( req.body.assignedUser ){
                const user = await User.findById( req.body.assignedUser ).exec();
                if( user ){
                    task.assignedUser = user.id;
                    task.assignedUserName = user.name;

                    if( !task.completed ){
                        user.pendingTasks.push( task.id );
                        await user.save();
                    }
                }
            }
            await task.save();
            res.status( 201 ).send( formatResponse( "Task created successfully", task ) );
        } catch( error ) {
            res.status( 500 ).send( formatResponse( "Error creating task", error ) ); // internal server error
        }
    });

    // One task -> GET, PUT, DELETE
    // GET
    router.route( '/tasks/:id' ).get( async( req, res ) => {
        try {
            const task = await Task.findOne( { _id: req.params.id } );
            if( !task )
                return res.status( 404 ).send( formatResponse( "Task not found", {} ) );
            else
                return res.status( 200 ).send( formatResponse( "Task retrieved successfully", task ) );
        } catch( error ){
            res.status( 500 ).send( formatResponse( "Error retrieving task", error ) );
        }
    });

    // PUT
    router.route( '/tasks/:id' ).put( async( req, res ) => {
        try {
            // check name attribute
            if( !req.body.name )
                return res.status( 400 ).send( formatResponse( "Name required", {} ) );

            // check deadline attribute
            if( !req.body.deadline )
                return res.status( 400 ).send( formatResponse( "Deadline required", {} ) );
            
            const existingTask = await Task.findById(req.params.id);
            if (!existingTask) {
                return res.status(404).send(formatResponse("Task not found", {}));
            }

            existingTask.name = req.body.name;
            existingTask.description = req.body.description || existingTask.description;
            existingTask.deadline = req.body.deadline;
            existingTask.completed = req.body.completed !== undefined ? req.body.completed : existingTask.completed;

            if( req.body.assignedUser ){
                const user = await User.findById( req.body.assignedUser ).exec();
                if( user ){
                    existingTask.assignedUser = user.id;
                    existingTask.assignedUserName = user.name;

                    if( !existingTask.completed ){
                        user.pendingTasks.push( existingTask.id );
                        await user.save();
                    }
                }
                else{
                    existingTask.assignedUser = "";
                    existingTask.assignedUserName = "unassigned";
                }
            }
            else{
                existingTask.assignedUser = "";
                existingTask.assignedUserName = "unassigned";
            }

            await existingTask.save();
            res.status( 201 ).send( formatResponse( "Task created successfully", existingTask ) );
        } catch( error ) {
            res.status( 500 ).send( formatResponse( "Error updating task", error ) );
        }
    });

    // DELETE
    router.route( '/tasks/:id' ).delete( async ( req, res ) => {
        try {
            const task = await Task.findByIdAndRemove( req.params.id );
            if( !task )
                return res.status( 404 ).send( formatResponse( "Task not found", {} ) );
            res.status( 200 ).send( formatResponse( "Task deleted successfully", {} ) );
        } catch( error ) {
            res.status( 500 ).send( formatResponse( "Error deleting task", error ) );
        }
    });

    return router;
}
const Pool=require('pg').Pool
const pool=new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port:5432,
})

const getUsers=(request,response)=>{
    pool.query('Select * From users order by id ASC',(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById=(request,response)=>{
    const id=parseInt(request.params.id);
    pool.query('Select * From users where id=$1',[id],(error,result)=>{
        if(error){
            throw error
        }
        response.status(200).json(result.rows);
    })
}

const createUser=(request,response)=>{
    const {name,email}=request.body;
    console.log(request.body);
    
    //console.log(name+email);
    pool.query('INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *',[name,email],(error,result)=>{
        if(error){
            response.status(404).send('Invalid');
            return;
        }
        response.status(201).send(`User added with ID: ${result.rows[0]["id"]}`)
    })
}

const updateUser=(request,response)=>{
    const id=parseInt(request.params.id);
    const {name,email}=request.body;
    console.log(name);
    pool.query(
        'UPDATE users SET name=$1,email=$2 WHere id=$3',[name,email,id],(error,results)=>{
            if(error){
                response.status(404).send('Invalid');
                console.log("came");
            return;
            }
            response.status(200).send(`User modified with ID: ${id}`)
        
        }
    )
}

const deleteUser=(request,response)=>{
    const id=parseInt(request.params.id);
    //console.log(id);
    pool.query('Delete from users where id=$1',[id],(error,results)=>{
        if(error){
            response.status(404).send('Invalid');
            return;
        }
        response.status(200).send(`User deleted with ID: ${id}`);

    })
}

module.exports={
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}


const mysql = require("./mysqlConnect");
const jwt = require('jsonwebtoken');

get= async ()=>{
   const usuarios = await  mysql.query("SELECT * FROM user");
   return usuarios;
}

login= async (data)=>{
   sql="SELECT id, name, email FROM user WHERE email='"
   +data.email+"' and password='"+data.senha+"'";
   const usuarios = await  mysql.query(sql);
   result=null;
   if(usuarios[0].id){
      const id=usuarios[0].id;
      var token = jwt.sign({id} , 'CIMOL', {expiresIn:1800}); 
      console.log("Fez login e gerou token!");
      result={ auth: true, token: token , user:usuarios[0]}
   }
   return result;
}

logout=(token)=> { 
   console.log("Fez logout e cancelou o token!");
   return{ auth: false, token: null }; 
};


//função que verifica se o JWT é ok
verifyJWT=(token)=>{ 
   if (!token){
      resp= { auth: false, message: 'Token não informado.' }; 
   }
   jwt.verify(token, 'CIMOL', function(err, decoded) { 
      
      if (err){
         resp= { auth: false, message: 'Token inválido.' };
      }
      if(decoded){
         resp= {auth:true, idUser:decoded.id};
      }
   });
   return resp;
} 


module.exports= {get, login, logout, verifyJWT}
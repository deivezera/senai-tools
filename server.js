const express = require('express');

const app =  express();



//configuração de arquivos extras (estáticos)

app.use(express.static('public'));

//habilitar body do formulário
app.use(express.urlencoded({ extended: true}))



// configurar a conexão com banco de dados

const Pool = require ('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: '5433',
    database: 'Banco de peças'
})


//configuração da template
const nunjucks = require('nunjucks');
nunjucks.configure("./", {
    express: app,
    noCache: true
})


app.get("/", function(req, res){
    db.query("SELECT * FROM tools", function(err, result){
        if(err) return res.send("erro no banco de dados")

        const tool = result.rows
        return res.render("index.html", { tool })
    })
    
});

app.post("/", function(req, res){
    //pegar dados do formulário e gravar o bagulho
    const nome = req.body.nome
    const fabricante = req.body.fabricante
    const descricao = req.body.descricao
    const quantidade = req.body.quantidade

    if(nome == "" || fabricante == "" || descricao == "" || quantidade == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    const query = `INSERT INTO tools ("nome", "fabricante", "descricao", "quantidade")
            VALUES($1, $2,$3,$4)`

    const values = [
        nome,
        fabricante,
        descricao,
        quantidade
    ]
    // colocar valores dentro do banco de dados.
    db.query(query, values, function(err){
        if(err){
            return res.send("erro no banco de dados meu parça. erro 69")
        }
    })

    return res.redirect("/")

})

app.listen(3333, function(){
    console.log("Server funcionando caraspa, porta 3333");
});

/*
Criar um sistema de email basico!
- O sistema deve ter 3 telas:
- Tela 1 (cadastrar.html): 
- Deve registrar o usuário.
- Não deve permitir cadastro duplicado.
- Tela 2 (login.html): 
- Entrar no sistema de email, usando o usuário e senha.
- Tela 3 (email.html): 
- Deve permitir escrever e enviar e-mails.
- Deve ter um botão sair (para destruir a sessão)
- Use variáveis de sessão para manter o usuário logado.
- Para enviar e-mails use a biblioteca nodemailer
https://www.w3schools.com/nodejs/nodejs_email.asp
*/

const express = require('express');
const nodemailer = require('nodemailer');
const session = require('express-session');
const { text } = require('stream/consumers');
const app = express();
var emails = [];
var senhas = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/cadastro.html');
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/cadastro', function(req, res){
    var usuario = req.query.email;
    var senha = req.query.senha;
    emails.push(usuario);
    senhas.push(senha);
    res.send(usuario + ' ' + senha);
})

app.use(session({
    secret: "chave criptográfica",
    secure: false,
    resave: false,
    saveUninitialized: false
}));

app.post('/email', (req, res) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: req.session.usuario, 
            pass: req.session.senha,
        }
    });
    
    transport.sendMail({ 
        from: req.session.usuario,
        to: req.body.destino,
        subject: req.body.titulo,
        text: req.body.texto,
    }).then(info=>{
        res.send(info);
    }).catch(e =>{
        res.send(e);
    });
});

app.get('/destroy', function(req, res) {
    req.session.destroy(function() {
        res.send("Sessão finalizada!");
    });
});

app.listen(3000);
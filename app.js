const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3002;
const secretKey = 'secretKey';

app.use(express.json());


mongoose.connect('mongodb+srv://alunoProva:idVLTHF4hVYdY886@prova-web.ypjsosu.mongodb.net', {
    retryWrites: true,
    w: 'majority',
    appName: 'prova-web'
});


const UserSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    senha: String,
});

const DisciplinaSchema = new mongoose.Schema({
    nome: String,
    codigo: String,
    professor: String,
});

const MatriculaSchema = new mongoose.Schema({
    alunoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    disciplinaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Disciplina' },
});

const User = mongoose.model('User', UserSchema);
const Disciplina = mongoose.model('Disciplina', DisciplinaSchema);
const Matricula = mongoose.model('Matricula', MatriculaSchema);


app.post('/registrar', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const hashedSenha = await bcrypt.hash(senha, 10);
        const user = new User({ nome, email, senha: hashedSenha });
        await user.save();
        res.status(201).send('Aluno registrado com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao registrar aluno');
    }
});


app.post('/autenticar', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Email ou senha incorretos');
        }
        const validSenha = await bcrypt.compare(senha, user.senha);
        if (!validSenha) {
            return res.status(400).send('Email ou senha incorretos');
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).send('Erro ao autenticar aluno');
    }
});


const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Acesso negado');
    }
    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).send('Token inválido');
    }
};


app.post('/matricular', authenticate, async (req, res) => {
    try {
        const { disciplinaId } = req.body;
        const matricula = new Matricula({ alunoId: req.user.userId, disciplinaId });
        await matricula.save();
        res.status(201).send('Matriculado com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao matricular');
    }
});


app.get('/disciplina', async (req, res) => {
    try {
        const disciplinas = await Disciplina.find();
        res.status(200).json(disciplinas);
    } catch (error) {
        res.status(400).send('Erro ao listar disciplinas');
    }
});


app.post('/disciplina', async (req, res) => {
    try {
        const { nome, codigo, professor } = req.body;
        const disciplina = new Disciplina({ nome, codigo, professor });
        await disciplina.save();
        res.status(201).send('Disciplina cadastrada com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao cadastrar disciplina');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

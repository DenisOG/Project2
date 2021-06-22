const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/discipline', require('./routes/discipline.routes'))
app.use('/api/direction', require('./routes/direction.routes'))
app.use('/api/chair',require('./routes/chair.routes'))
app.use('/api/group',require('./routes/group.routes'))
app.use('/api/laboratorywork', require('./routes/laboratory_work.routes'))
app.use('/api/institute',require('./routes/institute.routes'))
app.use('/api/professor',require('./routes/professor.routes'))
app.use('/api/student',require('./routes/student.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log('App has been started...'))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()
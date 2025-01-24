const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Los más guapos') );
bands.addBand( new Band('Perras del infierno') );
bands.addBand( new Band('Los tontos') );
bands.addBand( new Band('Los listos') );


//Mensajes de Sockets

io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', (payload) => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    //Escuchar: add-band el payload viene con el nombre de la banda con bands.addBand
    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    })

    //delete-band
    //bands.deleteBand

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })

    // client.on('emitir-mensaje', (payload) => {
    //     // console.log(payload);
    //     // io.emit('nuevo-mensaje', payload); //Esto se emite a todos los clientes conectados
    //     client.broadcast.emit('nuevo-mensaje', payload); //Esto se emite a todos menos al que lo emitio
    // });

});
const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


module.exports = {
    async index(req, res) {

        try {
            const posts = await Post.find().sort('-createdAt');
            return res.json(posts);
        } catch (err) {
            return res.status(404).send({ error: err })
        }

    },

    async store(req, res) {

        try {

            const { author, place, description, hashtags } = req.body //destruturação
            const { filename: image } = req.file;

            //change filename extension
            const [name] = image.split('.');
            const fileName = `${name}.jpg`;

            await sharp(req.file.path)
                .resize(500)
                .jpeg({ quality: 70 })
                .toFile(
                    path.resolve(req.file.destination, 'resized', fileName)
                )

            //delete unsized image
            fs.unlinkSync(req.file.path);

            const post = await Post.create({
                author,
                place,
                description,
                hashtags,
                image: fileName,
            });

            req.io.emit('post', post);
            
            return res.json(post);

        } catch (err) {
            return res.status(404).send({ error: err })
        }
    
    }
};
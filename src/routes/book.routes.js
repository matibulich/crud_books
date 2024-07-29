const express = require("express")
const router = express.Router()
const Book = require("../models/book.model")

//MIDDLE
const getBook =  async(req, res ,next)=>{
    let book;
    const {id}= req.params;
    if(!id.match(/^[a-fA-F0-9]{24}$/)){
        return res.status(400).json({
            message:"ID invalido"
        })

    }
    try {
        book = await Book.findById(id)
        if(!book){
            return res.status(404).json({
                message:"libro no encontrado"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "ERROR EN DB" + error.message
        })
    }
    res.book = book
    next()
}

//Obtener todos los libros (Get)
router.get("/", async(req, res)=>{
    try{
        const books = await Book.find()

        console.log("GET ALL", books)

        if (books.length ===0){
          return  res.status(204).json([])
        }
        res.json(books)
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

//Crear un libro (Post)

router.post("/", async (req, res)=>{

    const {title, author, genre, publication}= req?.body
    if(!title || !author || !genre || !publication){
        return res.status(400).json({message:"Todos los campos son obligatorios"})

    }

    const book = new Book(
        {
            title, author, genre, publication  
        }
    )

    try{
        const newBook = await book.save()
        res.status(201).json(newBook)
    }catch (error){
        res.status(400).json({
            message: error.message
        })
    }
})

//Traer un libro.
router.get("/:id", getBook,  async(req,res)=>{
res.json(res.book)
})

router.put("/:id", getBook,  async(req,res)=>{
   try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication = req.body.publication || book.publication;

    const updateBook = await book.save();
    res.json(updateBook)

   } catch (error) {
    res.status(400).json({
        message: error.message
    })
    
   }

    })

    router.delete("/:id", getBook,  async(req,res)=>{
        try{ 

        const book = res.book
        await book.deleteOne({
            _id:Book._id
        });
        res.json({
            message:`El libro ${book.title} ha sido eliminado`
        })}
        catch (error){
            res.status(500).json({
                message: error.message
            })
        }
        })


module.exports = router;
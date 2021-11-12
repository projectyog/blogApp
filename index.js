
import express from 'express';
import dotenv from 'dotenv';
import {MongoClient,ObjectId} from 'mongodb';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

export async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    return client;
}

app.get('/',(req,res) => {
    res.send('Hello');
});


app.get("/blogs",async(req,res)=>{
    const blogs = await getAllBlogs();
    res.send(blogs)
})


app.post("/blogs",async (req,res) => {
    const blogs = req.body;
    const result = await addBlogs(blogs);
    res.send(result);
})

app.delete("/blogs/:id", async(req,res) => {
   const { id } = req.params.id;
   const result = await deleteBlog(id);
   res.send(result);
})

app.put("/blogs/:id" , async(req,res) => {
      const { id } = req.params.id;
      const updateBlogData = req.body;
      const result = await updateBlog(id,updateBlogData);
      res.send(result);
})


app.listen(PORT, ()=>{
    console.log("The server is started !!",PORT)
})

async function getAllBlogs(){
    const client = await createConnection();
    const blogs = await client
      .db('BLOG')
      .collection("blogs")
      .find({})
      .toArray();

      return blogs;
}

async function addBlogs(blogs){
    const client = await createConnection();
    const  result = await client
      .db('BLOG')
      .collection("blogs")
      .insertMany(blogs);

      return result;
}

  async function deleteBlog(id){
    const client = await createConnection();
    const result = await client 
     .db("BLOG")
     .collection("blogs")
     .deleteOne({_id:ObjectId(id)})
  }

  async function updateblog(id,updateBlogData){
      const client = await createConnection();
      const result = await client 
          .db("BLOG")
          .collection("blogs")
          .updateOne({_id:ObjectId(id)},{$set:updateBlogData})
  
          return result;
        }
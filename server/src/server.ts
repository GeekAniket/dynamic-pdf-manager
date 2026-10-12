import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'
const port=Number(process.env.PORT||4000)
async function start(){const uri=process.env.MONGODB_URI;if(!uri)throw new Error('MONGODB_URI is required');await mongoose.connect(uri);console.log('MongoDB connected');app.listen(port,'0.0.0.0',()=>console.log(`API listening on port ${port}`))}
start().catch(error=>{console.error('Startup failed:',error);process.exit(1)})
process.on('SIGTERM',async()=>{await mongoose.disconnect();process.exit(0)})
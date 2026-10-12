import 'dotenv/config'
import mongoose from 'mongoose'
import {TemplateModel,TemplateConfiguration} from './models.js'
const templates=[
 {name:'Modern Invoice',description:'A crisp invoice with clear totals and a confident accent bar.',thumbnail:'invoice',category:'Invoice'},
 {name:'Corporate Invoice',description:'A formal, business-first invoice for client billing.',thumbnail:'corporate',category:'Invoice'},
 {name:'Professional Report',description:'A structured report with refined headings and readable sections.',thumbnail:'report',category:'Report'},
 {name:'Travel Voucher',description:'A neat voucher for itineraries, services and trip details.',thumbnail:'travel',category:'Voucher'},
 {name:'Booking Confirmation',description:'A customer-friendly confirmation with key booking information.',thumbnail:'booking',category:'Booking'}
]
await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/dynamic_pdf_manager')
for(const item of templates){
 const doc=await TemplateModel.findOneAndUpdate({name:item.name},{$setOnInsert:{...item,isActive:true}},{upsert:true,new:true})
 await TemplateConfiguration.updateOne({templateId:doc._id},{$setOnInsert:{templateId:doc._id,isDefault:item.name==='Modern Invoice',primaryColor:'#4f46e5',secondaryColor:'#a5b4fc',headerFont:'Roboto',bodyFont:'Arial',footerFont:'Open Sans',fontSize:10,headerBold:true,bodyBold:false,footerBold:false,headerAlign:'left',bodyAlign:'left',footerAlign:'center'}},{upsert:true})
}
const defaults=await TemplateConfiguration.find({isDefault:true})
if(defaults.length!==1){const first=await TemplateModel.findOne({name:'Modern Invoice'});await TemplateConfiguration.updateMany({},{$set:{isDefault:false}});if(first)await TemplateConfiguration.updateOne({templateId:first._id},{$set:{isDefault:true}})}
console.log('Seeded 5 templates and configurations.');await mongoose.disconnect()
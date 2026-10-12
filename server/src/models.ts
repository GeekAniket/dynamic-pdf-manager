import mongoose, { Schema } from 'mongoose'
const templateSchema = new Schema({name:{type:String,required:true,trim:true},description:{type:String,required:true},thumbnail:{type:String,default:'invoice'},category:{type:String,enum:['Invoice','Report','Voucher','Booking','Quotation'],required:true},isActive:{type:Boolean,default:true}},{timestamps:true})
const configSchema = new Schema({
 templateId:{type:Schema.Types.ObjectId,ref:'Template',required:true,unique:true},
 isDefault:{type:Boolean,default:false,index:true},primaryColor:{type:String,default:'#4f46e5'},secondaryColor:{type:String,default:'#a5b4fc'},
 headerFont:{type:String,enum:['Arial','Roboto','Times New Roman','Open Sans'],default:'Roboto'},bodyFont:{type:String,enum:['Arial','Roboto','Times New Roman','Open Sans'],default:'Arial'},footerFont:{type:String,enum:['Arial','Roboto','Times New Roman','Open Sans'],default:'Open Sans'},
 fontSize:{type:Number,min:9,max:18,default:10},headerBold:{type:Boolean,default:true},bodyBold:{type:Boolean,default:false},footerBold:{type:Boolean,default:false},
 headerAlign:{type:String,enum:['left','center','right'],default:'left'},bodyAlign:{type:String,enum:['left','center','right'],default:'left'},footerAlign:{type:String,enum:['left','center','right'],default:'center'},logoDataUrl:{type:String,default:undefined}
},{timestamps:true})
export const TemplateModel=mongoose.models.Template||mongoose.model('Template',templateSchema)
export const TemplateConfiguration=mongoose.models.TemplateConfiguration||mongoose.model('TemplateConfiguration',configSchema)
export type ConfigDoc = mongoose.InferSchemaType<typeof configSchema>
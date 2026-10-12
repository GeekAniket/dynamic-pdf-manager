import { z } from 'zod'
const font=z.enum(['Arial','Roboto','Times New Roman','Open Sans'])
const align=z.enum(['left','center','right'])
export const configSchema=z.object({
 templateId:z.string().min(1),isDefault:z.boolean().optional().default(false),
 primaryColor:z.string().regex(/^#[0-9a-fA-F]{6}$/),secondaryColor:z.string().regex(/^#[0-9a-fA-F]{6}$/),
 headerFont:font,bodyFont:font,footerFont:font,fontSize:z.number().min(9).max(18).default(10),
 headerBold:z.boolean().default(true),bodyBold:z.boolean().default(false),footerBold:z.boolean().default(false),
 headerAlign:align.default('left'),bodyAlign:align.default('left'),footerAlign:align.default('center'),
 logoDataUrl:z.string().max(1_400_000).regex(/^data:image\/(png|jpeg|webp|svg\+xml);base64,/).optional().or(z.literal(''))
})
export const pdfSchema=z.object({
 documentType:z.enum(['invoice','voucher','booking','quotation','report']),
 templateId:z.string().optional(),
 data:z.object({
  invoiceNumber:z.string().max(100).optional(),customerName:z.string().max(200).optional(),companyName:z.string().max(200).optional(),
  issueDate:z.string().max(40).optional(),dueDate:z.string().max(40).optional(),notes:z.string().max(2000).optional(),
  logoDataUrl:z.string().max(1_400_000).optional(),
  items:z.array(z.object({description:z.string().max(300),quantity:z.number().min(0).max(1_000_000),rate:z.number().min(0).max(1_000_000_000)})).max(100).optional()
 }).passthrough()
})
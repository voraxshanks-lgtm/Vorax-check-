require("dotenv").config();
const express=require("express");
const helmet=require("helmet");
const rateLimit=require("express-rate-limit");
const {parsePhoneNumberFromString}=require("libphonenumber-js");
const app=express(),PORT=process.env.PORT||3000;
const BASE=(process.env.INFOBIP_BASE_URL||"https://y4geyg.api.infobip.com").replace(/\\/+$/,"");
const KEY=process.env.INFOBIP_API_KEY||"",ADMIN=process.env.ADMIN_TEST_TOKEN||"";
app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'","https://fonts.googleapis.com"],fontSrc:["'self'","https://fonts.gstatic.com","data:"],scriptSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'","data:","https:"],connectSrc:["'self'"]}}}));
app.use(express.json({limit:"10kb"}));app.use(express.static("public"));
const checkLimit=rateLimit({windowMs:60000,limit:20,standardHeaders:"draft-7",legacyHeaders:false,message:{error:"Trop de vérifications. Réessaie dans une minute."}});
const testLimit=rateLimit({windowMs:60000,limit:5,standardHeaders:"draft-7",legacyHeaders:false});
app.get("/api/health",(_q,r)=>r.json({ok:true,service:"VORAX CHECK BAN V2",infobipConfigured:!!KEY,banCheckAvailable:false}));
app.post("/api/infobip/test",testLimit,async(req,res)=>{
 if(!ADMIN||req.get("authorization")!==`Bearer ${ADMIN}`)return res.status(401).json({ok:false,error:"Accès de test non autorisé."});
 if(!KEY)return res.status(503).json({ok:false,error:"INFOBIP_API_KEY n'est pas configurée."});
 try{
  const response=await fetch(`${BASE}/account/1/balance`,{headers:{Authorization:`App ${KEY}`,Accept:"application/json"},signal:AbortSignal.timeout(10000)});
  if(!response.ok)return res.status(502).json({ok:false,error:`Infobip a répondu HTTP ${response.status}. Vérifie la clé et ses autorisations.`});
  const data=await response.json();
  return res.json({ok:true,provider:"Infobip",authenticated:true,message:"Connexion Infobip confirmée. Ceci ne vérifie pas les bannissements WhatsApp.",currency:data.currency||null});
 }catch(e){return res.status(502).json({ok:false,error:"Impossible de joindre Infobip. Vérifie l'URL et réessaie."});}
});
app.post("/api/check",checkLimit,(req,res)=>{
 const raw=String(req.body?.phone||"").trim(),country=String(req.body?.country||"CI").toUpperCase();
 if(!raw||raw.length>40)return res.status(400).json({error:"Entre un numéro valide."});
 const parsed=parsePhoneNumberFromString(raw,country);
 if(!parsed||!parsed.isPossible())return res.status(400).json({error:"Numéro incomplet ou invalide. Vérifie l'indicatif et les chiffres."});
 return res.json({status:"UNKNOWN",label:"IMPOSSIBLE À VÉRIFIER",number:parsed.formatInternational(),valid:parsed.isValid(),message:"Le format est reconnu, mais aucune preuve fiable du statut de bannissement n'est disponible. Infobip ne confirme pas le statut d'un compte personnel."});
});
app.get("/health",(_q,r)=>r.json({ok:true}));
app.listen(PORT,()=>console.log(`VORAX CHECK BAN V2 lancé sur le port ${PORT}`));

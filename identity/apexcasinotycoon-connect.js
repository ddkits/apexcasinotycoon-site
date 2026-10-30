const cfg={"title":"Apex Casino Tycoon","apiOrigin":"https://api-apexcasino.reallexi.io","terms":"https://apexcasino.reallexi.io/terms.html?platform=android","privacy":"https://apexcasino.reallexi.io/privacy.html?platform=android"};
const texts={
en:['Connect your account','Check that this code matches the one shown in your game.','I agree to the Terms and Privacy Policy.','Terms','Privacy','Loading sign-in…','Your account is connected. Return to the game.','Connection failed or expired. Start again from your game.'],
ar:['اربط حسابك','تأكد أن الرمز يطابق الرمز الظاهر في لعبتك.','أوافق على الشروط وسياسة الخصوصية.','الشروط','الخصوصية','جارٍ تحميل تسجيل الدخول…','تم ربط حسابك. عد إلى اللعبة.','تعذر الربط أو انتهت صلاحيته. ابدأ مجدداً من اللعبة.'],
fr:['Connectez votre compte','Vérifiez que ce code correspond à celui affiché dans votre jeu.','J’accepte les conditions et la politique de confidentialité.','Conditions','Confidentialité','Chargement de la connexion…','Votre compte est connecté. Retournez au jeu.','Connexion échouée ou expirée. Recommencez depuis le jeu.'],
fa:['حساب خود را متصل کنید','بررسی کنید این کد با کد نمایش‌داده‌شده در بازی یکسان باشد.','شرایط و سیاست حریم خصوصی را می‌پذیرم.','شرایط','حریم خصوصی','در حال بارگیری ورود…','حساب متصل شد. به بازی برگردید.','اتصال ناموفق یا منقضی شد. دوباره از بازی شروع کنید.']};
const lang=new URL(location.href).searchParams.get('lang'),t=texts[lang]||texts.en;
document.documentElement.lang=texts[lang]?lang:'en';document.documentElement.dir=['ar','fa'].includes(lang)?'rtl':'ltr';
const el=id=>document.getElementById(id);for(const[id,index]of[['intro',0],['match',1],['agree',2],['terms',3],['privacy',4],['status',5]])el(id).textContent=t[index];el('terms').href=cfg.terms;el('privacy').href=cfg.privacy;
const id=location.hash.slice(1);history.replaceState(null,'',location.pathname+location.search);
const api=async(route,body)=>{const r=await fetch(cfg.apiOrigin+'/api/identity/'+route,{method:body?'POST':'GET',headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('connection_failed');return r.json();};
try{
if(!/^[a-f0-9]{48}$/.test(id))throw Error('invalid');const challenge=await api('challenge/'+id);el('code').textContent=challenge.code;
for(let n=0;!window.google?.accounts?.id&&n<100;n++)await new Promise(r=>setTimeout(r,150));if(!window.google?.accounts?.id)throw Error('provider_unavailable');
google.accounts.id.initialize({client_id:challenge.googleWebClientId,nonce:challenge.nonce,auto_select:false,ux_mode:'popup',callback:async result=>{if(!el('accept').checked)return;el('google').hidden=true;el('status').textContent=t[5];try{await api('challenge/'+id+'/complete',{idToken:result.credential,acceptedTerms:true});el('consent').hidden=true;el('status').textContent=t[6];}catch{el('status').textContent=t[7];}}});
google.accounts.id.renderButton(el('google'),{type:'standard',theme:'outline',size:'large',width:280});el('status').textContent='';el('accept').onchange=()=>{el('google').hidden=!el('accept').checked;};
}catch{el('consent').hidden=true;el('status').textContent=t[7];}


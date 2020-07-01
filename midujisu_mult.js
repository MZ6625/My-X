/*
=======================================
微信公众号iosrule  2020.5.6更新 by 红鲤鱼与绿鲤鱼与驴
   
   代码测试:
   1.完成多账号自动获取签到所需要的数据.
   2.完成签到，首页三个视频奖励，转盘什么的。觉得还不如手动，阅读奖励。

====================================


[rewrite_local]
#米读多账号签到
^https://apiwz\.midukanshu\.com/(wz/task/signInV2|wz/task/signVideoReward|user/readTimeBase/readTime|fiction/user/getInfo|wz/user/getInfo|wz/task/listV2) url script-request-body midujisu_mult5.6.js

[task_local]
 * * * * midujisu_mult5.6.js


MITM=apiwz.midukanshu.com
====================================
*/

const mycout=["iosrule","小时","特好","初见","德龙"];//5个账号昵称关键词，便于更新自己的账号数据。
const sign='1-5';//可以选择签到号码，1表示第1个，2表示第2个。0表示所有账号签到。1-5表示第1到5个账号签到。


const getck=1;//需要单个录入ck的账号序号。

const ckflag=1;//0表示关闭获取ck模块，进入签到模式，1表示开启ck获取模块，关闭签到模式。

const dingshi=1;//为1表示用圈叉间隔功能，0表示脚本运行后自动间隔运行，但是屏幕不能关闭，不能随意关闭开启圈叉，否则脚本要再次运行.
const notice=0;//为1表示部分消息的汇总释放.为0表示单个消息的释放.

//====================================

//以上是配置说明
const $iosrule = iosrule();//声明必须
var  midujisu="米读极速";
var readname=[];var readbdname=[];
var idname=[];var v_bd=[];
var videoname="md_vbd";
var taskname=[];

var r_key=[];var r_bd=[];
var id_b=[];var ts_bd=[];
var draw_sm=0;var draw_result="";
var vip=0;var allnotice="";
 var begin=0;var end=0;
     
//++++++++++++++++++++++++++++++++-

const  day_url="https://apiwz.midukanshu.com/wz/task/signInV2";


const task_url="https://apiwz.midukanshu.com/wz/task/listV2";



const draw_url="https://apiwz.midukanshu.com/wz/task/drawPrize";

const video_url="https://apiwz.midukanshu.com/wz/task/signVideoReward";

const read_url="https://apiwz.midukanshu.com/user/readTimeBase/readTime";
const id_url="https://apiwz.midukanshu.com/fiction/user/getInfo";

//++++++++++++++++++++++++++++++++




//2.程序主体部分

function get_ccl(b,e)
{
    for(var i=b-1;i<e;i++)
    {
           (function(i) {
           setTimeout(function() {
      
  
    readname[i]="md_rkey"+i;
     readbdname[i]="md_rbd"+i;
  
      taskname[i]="md_tskey"+i;
  
     idname="md_id"+i;
     
     videoname="md_vbd"+i;
  
  r_key[i]=$iosrule.read(readname[i]);
  r_bd[i]=$iosrule.read(readbdname[i]);
  ts_bd[i]=$iosrule.read(taskname[i]);
  id_b[i]=$iosrule.read(idname[i]);
  v_bd[i]=$iosrule.read(videoname);
   
                }, (i + 1) * 1000);
               })(i)
    }
}
function get_public()
{

  
  fuhao=sign.indexOf("-");
  
  if(fuhao>0)
 {end=sign.substring(fuhao+1,sign.length);
  begin=sign.substring(0,fuhao);
  
  get_ccl(begin,end);
  }
  else if(sign==0)
  {
        begin=1;end=mycout.length;  get_ccl(begin,end);
  }
  else if(sign>0)
  {
    begin=sign;end=sign;

      get_ccl(begin,end);
  }
  
  
  

}


function video(tt,xurl,v_bd)
{ var result1="";var result2="";
    var vtemp=[];

    
    
    for(var s=0;s<v_bd.length;s++)
    { (function(s) {
  
               setTimeout(function() {
    
    vtemp[s]=$iosrule.read(v_bd[s]);
    const llUrl = {url:xurl,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:vtemp[s]};
    
        $iosrule.post(llUrl, function(error, response, data) {
    var obj=JSON.parse(data)
         
result1+=obj.data.message+"/";
result2+=obj.data.amount+"/";
if(s==v_bd.length-1)
papa(tt,"[视频签到:]","共计执行视频操作"+s+1+"次"+"\n"+"奖励我也不知道:"+result1+"\n"+"金币奖励:"+result2)
        
         })



      
              }, (s + 1) * 3000)
             })(s)
    }
}

 
         
       
      


function day_sign(tt,xurl,xbody)
  {

 
   
   var result1="";var result2="";
    const llUrl = {url:xurl,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:xbody};
    
        $iosrule.post(llUrl, function(error, response, data) {
    var obj=JSON.parse(data)

if (obj.code==0){
if(obj.data.amount==0)
{result1="[日签到:]"+"重复签到.";
result2=obj.data.confirm_button+",可以获得"+obj.data.sign_video_amount+"金币.";
papa(tt,result1,result2);}

else {result1="[日签到:]"+"签到成功.";result2="获得金币:"+obj.data.amount;
papa(tt,result1,result2);}}
         else
         {result2=obj.message;result1="日签到失败,请更新任务数据cookie。"
           papa(tt,result1,result2);
         }})
        
         

  }
  function draw(tt,xurl,xbody)
    {
     var result1="";var result2="";

      const llUrl = {url:xurl,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:xbody};
      
          $iosrule.post(llUrl, function(error, response, data) {
      var obj=JSON.parse(data)
           
           draw_result+="["+(draw_sm+1)+"次结果:]"+obj.data.title+"\n";
if(draw_sm==8)
{
  if(notice==1)
  draw_result="完全不知道."
papa(tt,"[幸运大转盘]",draw_result)
}
           draw_sm++;
           if(draw_sm<9){
         setTimeout(function(){
draw(tt,xurl,xbody);
         }, 2* 1000 );
         }
  
          
           })
           
  
    }
  
  
  function gettask(tt,xurl,xbody)
   {var result1="";var result2="";
   var x1="";var x2="";var x3="";var x4="";var tsig="";
 const llUrl = {url:xurl,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:xbody};
    
        $iosrule.post(llUrl, function(error, response, data) {
    var obj=JSON.parse(data);

result1="[任务列表]";

for(var i=0;i<obj.data.length;i++)
{
  if( obj.data[i].type=="header")
    { x1="[金币:]总金币:"+obj.data[i].data.coin+"今日阅读时长:"+obj.data[i].data.read_time+"分"+"\n";
    if(obj.data[i].data.coin==0)
    result1+=",可能数据过期,请更新任务cookie";
    
    }
    
  if( obj.data[i].type=="signv2")
{if(obj.data[i].data.today_is_sign==1)
tsig="今天完成签到.";
else  tsig="今天未签到.";
  x2="[签到:]"+"连续签到:"+obj.data[i].data.sub_title+"."+tsig+"\n";}
  
  
  if( obj.data[i].type=="ext_pit")
{ x3="[视频金币:]"+"剩余时间:"+obj.data[i].data[0].remain_seconds+"/分"+obj.data[i].data[1].remain_seconds+"分/"+obj.data[i].data[0].remain_seconds+"分"+"\n"+" 点击情况况:"+obj.data[i].data[0].can_click+"/"+obj.data[i].data[1].can_click+"/"+obj.data[i].data[2].can_click+"\n";}

if (obj.data[i].type=="task")
{x4="[日常任务:]"+obj.data[i].data.list[0].sub_title+"-"+obj.data[i].data.list[0].button_text+"\n"+obj.data[i].data.list[0].sub_title+"-"+obj.data[i].data.list[0].button_text+"\n"+obj.data[i].data.list[0].sub_title+"-"+obj.data[i].data.list[0].button_text;}
}


papa(tt,result1,x1+x2+x3+x4);

       
       
       })
       }


//阅读间隔奖励
function read_15(tt,xurl,xhead,xbody)
{
    var result1="";var result2="";var tishi="";
  if(dingshi==0)
  {
      var heart=getRandom(60, 300);
      tishi=",阅读间隔:"+heart+"分";
  }
       const llUrl = {url:xurl,headers:JSON.parse(xhead),body:xbody};
       
           $iosrule.post(llUrl, function(error, response, data) {
       var obj=JSON.parse(data)


    
      result1="[阅读进度:]"+"总金币"+obj.data.popup.sub_title+","+obj.data.popup.corner;
  result2="金币:"+obj.data.coin+".阅读时长:"+obj.data.readTotalMinute+"分."+"\n"+"当前时间:"+cotime(obj.currentTime)+tishi;
  
  papa(tt,result1,result2)
  if(dingshi==0)
       {setTimeout(function(){
read_15(tt,xurl,xhead,xbody);
         }, heart* 1000 );}
    
   
   
           
            
  


  



})
}




function getRandom(start, end, fixed=0) {
            let differ = end - start
            let random = Math.random()
            return (start + differ * random).toFixed()
}



  

function main_writeck()
{    
  if ($request.headers) {

 var urlval = $request.path;

var md_header=$request.headers;
var md_bd=$request.body;
var vval1="";var vval2="";var vval3="";
var rval="";var rbody="";var idval="";
    var idname="md_id"+(getck-1);
//🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟
if(urlval.indexOf("user/getInfo")>=0)

 {
   idval=md_bd;getnick=true;
   const llUrl = {url:id_url,headers:{"Content-Type":"application/x-www-form-urlencoded"},body:idval};
      
          $iosrule.post(llUrl, function(error, response, data) {
      var obj=JSON.parse(data);

      if(obj.code==0)
      var l=obj.data.nickname;
    else{ papa(xx,"","获取昵称标识失败❌");return;}
    
    if(l.indexOf(mycout[getck-1])>=0)
{var ll=(getck-1)+"+"+l;


 var idb=$iosrule.write(ll,idname[getck-1]);

 if (idb==true) 
  papa("写入昵称数据",midujisu+getck, "更新写入昵称:"+l+",成功否:"+idb);}else
  papa("当前账号获取cookie错误","配置错误","当前账号为:"+l+",与配置获取cookie的账号关键词"+mycout[getck-1]+"不一致，重新配置获取cookie.")
return;

})}
else 
{
  var jiance=$iosrule.read(idname[getck-1]);

      if (jiance!= (undefined || null))
      {
        var id=jiance.substring(0,jiance.indexOf("+"));
     
        
        
if (id==getck-1)
   {
    var need_ck=getck-1;
     readname[need_ck]="md_rkey"+need_ck;
   readbdname[need_ck]="md_rbd"+need_ck;
   
   taskname[need_ck]="md_tskey"+need_ck;
    

    
idname[need_ck]="md_id"+need_ck;
nickname=jiance.substring(jiance.indexOf("+"),jiance.length);
 
 sub_writeck(midujisu+getck+"昵称:"+nickname,taskname[need_ck],readname[need_ck],readbdname[need_ck],videoname+need_ck);}
}}}

}





//++++++++++++++++++++++++++++++++

//3.需要执行的函数都写这里
function sub_main(b,e)
{
   for(var i=b-1;i<e;i++)
    {
           (function(i) {
           setTimeout(function() {
             
     var tt=midujisu+"["+e+"-"+(i+1)+"]"+"昵称:"+id_b[i];
     gettask(tt,task_url,ts_bd[i]);
     
  draw(tt,draw_url,ts_bd[i]);
  
  
  day_sign(tt,day_url,ts_bd[i]);
  
  video(tt,video_url,v_bd+i);
        read_15(tt,read_url,r_key[i],r_bd[i]);
      }, (i + 1) * 61000)
              })(i)
     
  
}
}

function main()
{
  var fuhao=sign.indexOf("-");

  if(fuhao>0)
 {end=sign.substring(fuhao+1,sign.length);
  begin=sign.substring(0,fuhao);sub_main(begin,end);
  }
   else if(sign==0)
    {
          begin=1;end=mycout.length;
       
    }
    else if(sign>0)
    {
      begin=sign;end=sign;
      sub_main(begin,end);
    }
    
 
}














//++++++++++++++++++++++++++++++++++++
//4.基础模板




if ($iosrule.isRequest) {
if(ckflag==1)  main_writeck();
  
  $iosrule.end()
} else {
    
  if(ckflag==0)
  {
    get_public();
  main();}
  $iosrule.end()
}





function sub_writeck(tt,ts,r_k,r_b,v_b) {

  if ($request.headers) {

 var urlval = $request.path;

var md_header=$request.headers;
var md_bd=$request.body;
var vbody="";
//🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟

if(urlval.indexOf("/task/signVideoReward")>=0)
{
  vbody=md_bd;
       for(var ss=0;ss<v_b.length;ss++)
            {
         v_b=v_b[ss];

 var vb= $iosrule.write(vbody, v_b);
if (vb==true) 
 papa("写入视频数据", "", "获取"+tt + "视频奖励数据成功");return;}
}





//🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰







if(urlval.indexOf("wz/task/listV2")>=0)
{
  var tsval=md_bd;
 var tsb= $iosrule.write(tsval, ts);
if (tsb==true) 
 papa("首次写入任务数据ck", "", "获取"+tt + "任务数据成功");
}


if(urlval.indexOf("user/readTimeBase/readTime")>=0)
{
  var rval=JSON.stringify(md_header);
  var rbody=md_bd;


 var rk= $iosrule.write(rval, r_k);
var rb=$iosrule.write(rbody, r_b);

if (rk==true&&rb==true) 
 papa("写入阅读数据ck","","获取"+tt + "阅读数据成功",);}








}}





function cotime(timestamp) {
  const date = new Date(timestamp * 1000)
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = date.getHours() + ':'
  const m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1) + ''
  return M + D + h + m
}



function papa(x,y,z){

if(notice==1){
    vip++;
 allnotice+="["+vip+".]"+y+"\n"+z+"\n";
  if(vip==5)
  {
  $iosrule.notify(x,"长按查看详情",allnotice);
  }

}
else   $iosrule.notify(x,y,z);}


function iosrule() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};

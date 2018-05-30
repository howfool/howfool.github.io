sqnum=22;				//用餐区域边长
pnum=sqnum*sqnum;		//面积
lifemin=20;				//用餐时间最小值
lifemax=300;				//用餐时间最大值
pmin=1;
pmax=5;
function createmem()	//生成小组单个成员的函数
{
    var mem=new Object;
    mem.x=null;
    mem.y=null;
    return mem;
}
function creategroup()	//生成一个多人用餐小组的函数
{
    var group=new Object;
    var rand=Math.random();
    group.num=Math.floor(parseInt(pmin)+(pmax - pmin)*rand);
    var memall=new Array(0);
    for(var i=0;i<group.num;i++)
    {
        memall.push(createmem());
    }
    group.mem=memall;
    var current=new Date();
    group.birth=Date.parse(current);
    var rand=Math.random();
    group.life=((lifemax-lifemin)*rand+parseInt(lifemin))*1000;
    showw("就餐"+group.num+"人,寿命"+Math.floor(group.life/1000));
    group.unsit=function()
    {
        for(i in this.mem)
        {
            if(this.mem[i].x)
            {
                $(".x"+this.mem[i].x+" .y"+this.mem[i].y).attr("title","unsit");
                sat.unsit(this.mem[i].x,this.mem[i].y);
            }
        }
    }
    return group;
}
/*********/

function test0(list1,x,y,num )
{
    list=new Array();
    var temp =expandf(list1,x,y,list,0,num);
    var temp2;
    while(!(list==false))
    {temp2 =list.pop();
        list1[temp2.x*sqnum+temp2.y]=0;
    }
    list=null;
    return num <=temp;
}
function expandf(list,x,y,list2,num,mnum)			//测试可用空间数
{
    var i=0;

    if(!list[x*sqnum+y])
    {
        if(num>=mnum)
            return 0;
        list[x*sqnum+y]=1;
        var temp =new Object;
        temp.x=x;
        temp.y=y;
        list2.push(temp);
        if(!list[x*sqnum+y+1])
        {
            //list[x*sqnum+y+1]=1;
            i+=expandf(list,x,y+1,list2,i,mnum);
            //list[x*sqnum+y+1]=0;
        }
        if(!list[x*sqnum+y-1])
        {
            //list[x*sqnum+y-1]=1;
            i+=expandf(list,x,y-1,list2,i,mnum);
            //list[x*sqnum+y-1]=0;
        }
        if(!list[(x+1)*sqnum+y])
        {
            //list[(x+1)*sqnum+y]=1;
            i+=expandf(list,x+1,y,list2,i,mnum);
            //list[(x+1)*sqnum+y]=0;
        }
        if(!list[(x-1)*sqnum+y])
        {
            //list[(x-1)*sqnum+y]=1;
            i+=expandf(list,x-1,y,list2,i,mnum);
            //list[(x-1)*sqnum+y]=0;
        }
        i++;
    }
    return i;
}

/********/
function expandr(list,x,y,num,agroup)	//在表上以x.y为起点分配
{
    if(num)
    {
        sat.sit(x,y);
        num--;
        agroup.mem[num].x=x;
        agroup.mem[num].y=y;
        if(!list[x*sqnum+y+1])
        {
            num=expandr(list,x,y+1,num,agroup);
        }
        if(!list[x*sqnum+y-1])
        {
            num=expandr(list,x,y-1,num,agroup);
        }
        if(!list[(x+1)*sqnum+y])
        {
            num=expandr(list,x+1,y,num,agroup);
        }
        if(!list[(x-1)*sqnum+y])
        {
            num=expandr(list,x-1,y,num,agroup);
        }
    }
    return num;
}
sat=new Object;
sat.locat=new Array(pnum);		//座位表
sat.init=function()
{
    for(var i=0;i<pnum;i++)
    {
        this.locat[i]=0;
    }
    for(var i=0;i<sqnum;i+=sqnum-1)
        for(var j=0;j<sqnum;j++)
        {this.locat[i*sqnum+j]=-1;
            $(".x"+i+" .y"+j).attr("title","wall");
        }
    for(var j=0;j<sqnum;j+=sqnum-1)
        for(var i=0;i<sqnum;i++)
        {this.locat[i*sqnum+j]=-1;
            $(".x"+i+" .y"+j).attr("title","wall");
        }
}
sat.testif=function(num)					//测试可行座位,返回可行表///此处需要优化
{
    var can=new Array();
    for(var i=0;i<pnum;i++)
    {

        if(test0(this.locat,Math.floor(i/sqnum),i%sqnum,num))
            can.push(i);
    }
    return can;
}
sat.sit=function(x,y)
{
    this.locat[x*sqnum+y]=1;
    $(".x"+x+" .y"+y).attr("title","sit");
    setTimeout("$('.x"+x+" .y"+y+"').attr('title','eat')",1000);
}

sat.unsit=function(x,y)
{
    this.locat[x*sqnum+y]=0;
    $(".x"+x+" .y"+y).attr("title","unsit");
}
/***********************************************************************/
if(typeof(Worker)=="undefined"){
    function groupsit(agroup)		//随机分配座位，失败返回false
    {
        var temp1=sat.testif(agroup.num);
        if(!temp1) {showw("座位不足");return false;}
        var rand=Math.random();
        var temp2=Math.floor(rand*temp1.length);
        return expandr(sat.locat,Math.floor(temp1[temp2]/sqnum),temp1[temp2]%sqnum,agroup.num,agroup);
    }


}
else {
    function groupsit(agroup){
        w=new Worker("js/worker.js");
        w.postMessage({num:agroup.num,list:sat.locat});
        w.onmessage=function (e)
            {
                var temp1=e.data;
                if(!temp1) {showw("座位不足");return false;}
                var rand=Math.random();
                var temp2=Math.floor(rand*temp1.length);
                var temp3= expandr(sat.locat,Math.floor(temp1[temp2]/sqnum),temp1[temp2]%sqnum,agroup.num,agroup);
                this.terminate();
                //var nob=groupsit(newg);
                if(!temp3) {
                    grouplist.push(agroup);
                }
                else{
                    showw(temp3+"人就餐失败");
                }
            }




    }

}


/******************************************************************/

function showw(a)
{
    document.getElementById("warning").innerHTML=a;
    $("#warning").show(500,function(){setTimeout("$('#warning').hide(500)",1000)


    })}

sqnum=22;				//用餐区域边长
pnum=484;		//面积
onmessage=function(e){

    var temp=testif(e.data.num,e.data.list);
    postMessage(temp);
}

testif=function(num,list)					//测试可行座位,返回可行表///此处需要优化
{
    var can=new Array();
    for(var i=0;i<pnum;i++)
    {

        if(test0(list,Math.floor(i/sqnum),i%sqnum,num))
            can.push(i);
    }
    return can;
}
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
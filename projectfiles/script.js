const children=$("tbody").children();
let children_array=[];
//convert children to an array
for(let i=0;i<children.length;i++){
    children_array.push(children[i]);}

const items=[];
children_array.forEach(element=>{

    const rowDetails={
        Name:element.getAttribute('data-name'),
        Size:parseInt(element.getAttribute('data-size')),
        Last_Modified:parseInt(element.getAttribute('data-time')),
        html:element.outerHTML
    };
    items.push(rowDetails);
});
//order state
const sortStatus={
    name:'none',//
    size:'none',
    time:'none'
};
const sort_name=(items,options)=>{
    items.sort((item1,item2)=>{
        let name1=item1.Name.toUpperCase();
        let name2=item2.Name.toUpperCase();
        if(name1<name2){
            return -1;
        }if(name1>name2){
            return 1;
        }
        return 0;
    });
    if(options==='down'){
            items.reverse;
        }

};
const  fill_table_body=items=>{
    const content=items.map(element=>
        element.html).join('');
    $("tbody").html(content);
}
document.getElementById("name").addEventListener('click',()=>{
    if(['none','down'].includes(sortStatus.name)){
        //sort in ascending order
        sort_name(items,'up')
        sortStatus.name='up';
    }
    if(sortStatus.name==='up'){
        sort_name(items,'down')
        sortStatus.name='down';
    }
    fill_table_body(items);
});

function person(first,last,age,eye){
    this.firstName=first;
    this.lastName=last;
    this.age=age;
    this.eyeColor=eye;
}
var myFather=new person('karan','nakra','20','blue');
document.getElementById('demo').innerHTML=myFather.firstName+' '+myFather.lastName;
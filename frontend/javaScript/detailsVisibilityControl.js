async function toggleDetails(type, hiddenType){
    let holder = document.getElementsByClassName(type);
    for(let i = 0;i < holder.length;i++){
        holder[i].classList.toggle(hiddenType);
    }
}
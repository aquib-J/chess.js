document.getElementById('SetFen').addEventListener('onClick', (e) => {
    let fenstr = document.getElementById('fenIn').value;
    console.log(`${fenstr}`);
    ParseFen(fenstr);
    PrintBoard();
    console.log('event working');

});
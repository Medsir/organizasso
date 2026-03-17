import { useState , useEffect, useRef } from 'react'

function Rwx(){
    const [rwx, setRwx] = useState({read:0, write:0, execute:0})

    const check = (e) => {
        rwx[e.target.id] = e.target.value ? 1 : 0
    }

    var [rwxdisplay, setRwxDisplay] = useState(0)

    useEffect(()=>{
        setRwxDisplay(4*rwx['read']+2*rwx['write']+1*rwx['execute']);
        console.log(rwxdisplay);
    }, [rwx])

    return(
        <>
        <label htmlFor="read">Read</label><input type="checkbox"id="read" onChange={check}/>
        <label htmlFor="write">Read</label><input type="checkbox"id="write" onChange={check}/>
        <label htmlFor="execute">Read</label><input type="checkbox"id="execute" onChange={check}/><br />
        <p>Code numerique correspondant : {rwxdisplay}</p>
        </>
    )

}
export default Rwx;
"use client"
import { useState,useEffect} from "react"
import axios from "axios"

interface ATTRIBUTES{
    name: string
    description: string
}
interface DATA {
   "id": string
   "type": string
   "attributes": ATTRIBUTES
}

export default function Sample_Page() {
const[rdata,setRdata] = useState<DATA[]>([])
const getData = async () => {
    const response = await axios.get("https://dogapi.dog/api/v2/breeds")
    setRdata(response.data.data)
console.log(response.data.data)
}
useEffect(()=>{
    getData()
},[])
return(
    <div>
        {rdata.map((item)=>(
            <div key={item.id}>
                <h1>{item.attributes.name}</h1>
                <p>{item.attributes.description}</p>
            </div>
        ))}
    </div>
)
}
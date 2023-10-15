import React, { useRef, useState } from 'react'
import "./ImageGenerator.css"
import defaultImage from "../assets/defaultImage.png"
import { BiCommentError } from "react-icons/bi"

const ImageGenerator = () => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const [imageUrl, setImageUrl] = useState("/");
    const [isLoading, setIsLoading] = useState(false)
    const [canGenerate, setCanGenerate] = useState(true)
    const [error, setError] = useState(null)

    const inputRef = useRef(null);

    const imageGenerator = async ()=>{
        setError(null)
        if(inputRef.current.value?.length < 3){
            setError("Prompt is too short")
            return 0;
        } else if(inputRef.current.value?.length > 100){
            setError("Prompt is too long")
            return 0;
        }

        if(apiKey){
            setIsLoading(true);
            
            try{
                const response = await fetch('https://api.openai.com/v1/images/generations',{
                    method:"POST",
                    headers: {
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${apiKey}`,
                        "User-Agent": "Chrome",
                    },
                    body: JSON.stringify({
                        prompt: `${inputRef.current.value}`,
                        n: 1,
                        size: "512x512",
                    }),
                });
                let data = await response.json();
                let data_array = data.data
                setImageUrl(data_array[0].url)
                setCanGenerate(false)

                setTimeout(()=>{
                    setCanGenerate(true)
                }, 2000)
                setIsLoading(false)

            } catch(error){
                console.error(error)
                setError(error.message)
            }

        } else{
            setError("Please add your API key to continue")
        }
    }

    return (
    <div className={isLoading ? 'ai-image-generator loading' : 'ai-image-generator'}>
        <div className='header'>
            AI image <span>generator</span>
        </div>
        <div className='img-loading'>
            <div className='image'>
                <img src={imageUrl === "/" ? defaultImage : imageUrl} width={200} alt='' />
                <div className='backdrop'>
                    <div className='spinner'></div>
                    <p>
                        Generating Image...
                    </p>
                </div>
                {error && <div className='backdrop x'>
                    <div className='error'>
                        <BiCommentError />
                    </div>
                    <p>
                        {error ? error : "Oops an Error Occured"}
                    </p>
                </div>}
            </div>
        </div>
        <div className='search-box'>
            <input type='text' className='search-input' placeholder='Describe What You Want to See' ref={inputRef} />
            <div className='generate-btn' onClick={()=>{
            imageGenerator()
        }} style={(isLoading || !canGenerate) ? {
            pointerEvents: "none"
        }:{
            pointerEvents: "all"
        }}>
                {canGenerate ? <>
                    {isLoading ? "Please wait" : "Generate"}
                </> : <>{isLoading ? "Please wait" : "Refreshing..."}</>}
            </div>
        </div>
    </div>
  )
}

export default ImageGenerator
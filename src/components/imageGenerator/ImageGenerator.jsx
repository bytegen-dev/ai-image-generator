import React, { useEffect, useRef, useState } from 'react'
import "./ImageGenerator.css"
import defaultImage from "../assets/defaultImage.png"
import { BiCommentError } from "react-icons/bi"
import { FaKey } from "react-icons/fa"

const ImageGenerator = () => {
    const apiKeyEnv = process.env.REACT_APP_OPENAI_API_KEY;

    const [imageUrl, setImageUrl] = useState("/");
    const [isLoading, setIsLoading] = useState(false)
    const [canGenerate, setCanGenerate] = useState(true)
    const [error, setError] = useState(null)
    const [apiKey, setApiKey] = useState(false)
    const [noKey, setNoKey] = useState(false)
    const [apiKeyValue, setApiKeyValue] = useState("")

    useEffect(()=>{
        const apiKeyLocalStorage = localStorage.getItem("openAiKey");
        if(apiKeyLocalStorage){
            setApiKey(apiKeyLocalStorage)
            setNoKey(false)
        } else{
            if(apiKeyEnv){
                setApiKey(apiKeyEnv)
                setNoKey(false)
            } else{
                setNoKey(true)
            }
        }
    },[apiKeyEnv])

    const addNewApiKey = (e)=>{
        e.preventDefault()
        if(apiKeyValue){
            setApiKey(apiKeyValue)
            localStorage.setItem("openAiKey", apiKeyValue)
            setNoKey(false)
        }
    }

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
                console.log(data)
                let data_array = data.data
                if(data.data?.length){
                    setImageUrl(data_array[0].url)
                } else{
                    setError(data.error.message || "An Error Occured" )
                }
                setCanGenerate(false)

                setTimeout(()=>{
                    setCanGenerate(true)
                }, 2000)
                setIsLoading(false)

        } else{
            setError("Please add your API key to continue")
        }
    }

    return (
        <>
            <button className='change-key' onClick={()=>{
                setApiKey(null)
                setNoKey(true)
            }}>
                <FaKey />
            </button>
            {noKey && <div className='popup'>
                <div className='container'>
                    <h1>
                        Hello, Please add your Open AI API Key to Continue
                    </h1>
                    <form onSubmit={addNewApiKey}>
                        <input required placeholder='Your OpenAi api key' type='text' minLength={10} value={apiKeyValue} onChange={(e)=>{
                            setApiKeyValue(e.target.value)
                        }} />
                        <button>
                            Add Api Key
                        </button>
                    </form>
                </div>
            </div>}
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
        </>
  )
}

export default ImageGenerator
import React from 'react'
import { useState, useEffect } from 'react'



const Posts = () => {
    const [Posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
         .then(response => response.json())
         .then((data)=>{setPosts(data)})
         .catch((error)=>{console.log("Error Fetching Posts",error)})
    },[])
     
    console.log(Posts)

  return (
    <>
    <div>
        <h3>
            Posts (Array):
        </h3>
        <ul>
            {Posts.map((post)=>(
                <li key={post.id}>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                </li>

            ))}
        </ul>
    </div>
    
    
    </>
  )
}

export default Posts
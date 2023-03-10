import '../styles/list.css'
import movieImage from "../assets/OIP.jpg"
export default function List(){
    return (
        <div className='listSection'>
            <h1>Movie List</h1>
            <div className="card--hero">
                <div className="img">
                    <img src={movieImage} alt="Movie" />
                </div>
                <div className="content">
                    <h2>Movie Name</h2>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste temporibus deleniti corrupti beatae sit ipsam eaque! Ipsa excepturi nemo perferendis cumque corporis fugiat quibusdam modi, numquam atque repellat ad debitis.</p>

                </div>
            </div>
        </div>
    )
}
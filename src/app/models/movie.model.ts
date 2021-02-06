/*
    on peut fair eune interface mais pas Instantiable
    interface MovieModel {
        title: string;
        desc: string;
        image: string;
        duration:number;
    }
*/

export class MovieModel {
    title: string;
    desc: string;
    image: string;
    date: Date;
    id: number;
    score: number;

    constructor(title:string,
                overview:string,
                backdrop:string,
                release_date:Date,
                id:number,
                score: number ) {
        this.title = title;
        this.desc = overview;
        this.image = backdrop;
        this.date = new Date(release_date);
        this.id = id;
        this.score = score;
    }
}
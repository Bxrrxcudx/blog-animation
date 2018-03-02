import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { searchMovies, getMovie } from "../../api/omdb";
import { Link } from "react-router-dom";
import { TweenMax } from "gsap";
import "./Home.css";

const Fade = ({ children, ...props }) => (
  <CSSTransition {...props} timeout={3000} classNames="fade">
    {children}
  </CSSTransition>
);

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
        term: "Scary Movie",
        type: "movie",
        articles: [],
        movies: [],
        show: false
    };

    // Tableau de référence des images.
    this.refImages = [];
  }

  async componentDidMount() {
      this.state.movies = await searchMovies({
        terms: this.state.term
    });
    console.log(this.state.movies);
    const firstFullDataMovie = await getMovie(this.state.movies[0].imdb);
    console.log(firstFullDataMovie);

    this.setState({
      show: true
    });
  }

  async handleChange(event) {
      if (event.target.value) {
          const movieTerm = event.target.value;
          const moviesSearch = await searchMovies({
              terms: event.target.value
          });
          this.setState({
              movies : moviesSearch,
              term : movieTerm
          });
      } else {
          const moviesSearch = await searchMovies({
              terms : 'Scary Movie'
          });
          this.setState({
              movies : moviesSearch
          });
      }
  }

  async handleFilter(event) {
      if (event.target.value) {
          const movieType = event.target.value;
          const moviesFilter = await searchMovies({
              terms : this.state.term,
              type : event.target.value
          });

          this.setState({
              movies : moviesFilter,
              type : movieType
          })
      } else {
          const moviesFilter = await searchMovies({
              terms : this.state.term,
              type : this.state.type
          });

          this.setState({
              movies : moviesFilter
          })
      }
  }

  animate(i) {
    TweenMax.to(this.refImages[i], 0.5, { opacity: 0 });
  }

  render() {
    let movies = this.state.movies;
    return (
      <div className="Home">
          <div className="search-bar">
              <label htmlFor="search">Rechercher un film, un auteur ...</label>
              <input type="text" id="search" onChange={(e) => this.handleChange(e)}/>
          </div>
          <div className="filters">
              <label htmlFor="filter">Trier par type</label>
              <select name="filter" id="filter" defaultValue={'movie'} onChange={(e) => this.handleFilter(e)}>
                  <option value="series">Serie</option>
                  <option value="movie">Movie</option>
                  <option value="episode">Episode</option>
              </select>
          </div>
        <div className="Home-intro">
          <div className="container">
            <TransitionGroup className="todo-list">
              {movies.map((movie, i) => (
                <Fade key={movie.imdb}>
                  <div className="Card">
                    <Card>
                      <Link to={`/movie/${movie.imdb}`} className="Card-link">
                        <CardHeader
                          title={`${movie.title}`}
                          subtitle={`${movie.year}`}
                          avatar="https://cdn.drawception.com/images/avatars/569903-A55.jpg"
                        />
                        <div ref={img => (this.refImages[i] = img)}>
                          <CardMedia
                            className="Card-media"
                            style={{ backgroundImage: `url(${movie.poster})` }}
                            overlay={<CardTitle title={movie.title} />}
                            overlayContentStyle={{ background: "transparent" }}
                            overlayStyle={{ color: "#fff" }}
                          />
                        </div>
                        <CardText>{movie.excerpt}</CardText>
                      </Link>
                    </Card>
                  </div>
                </Fade>
              ))}
            </TransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

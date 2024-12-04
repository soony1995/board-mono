package handlers

import (
	"board/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

var posts = []models.Post{}

// GetPosts returns all posts
func GetPosts(c echo.Context) error {
	return c.JSON(http.StatusOK, posts)
}

// GetPost returns a specific post
func GetPost(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	for _, post := range posts {
		if post.ID == id {
			return c.JSON(http.StatusOK, post)
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"message": "Post not found"})
}

// CreatePost creates a new post
func CreatePost(c echo.Context) error {
	post := new(models.Post)
	if err := c.Bind(post); err != nil {
		return err
	}
	post.ID = len(posts) + 1
	posts = append(posts, *post)
	return c.JSON(http.StatusCreated, post)
}

// UpdatePost updates an existing post
func UpdatePost(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	post := new(models.Post)
	if err := c.Bind(post); err != nil {
		return err
	}

	for i, p := range posts {
		if p.ID == id {
			post.ID = id
			posts[i] = *post
			return c.JSON(http.StatusOK, post)
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"message": "Post not found"})
}

// DeletePost deletes a post
func DeletePost(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	for i, post := range posts {
		if post.ID == id {
			posts = append(posts[:i], posts[i+1:]...)
			return c.NoContent(http.StatusNoContent)
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"message": "Post not found"})
}

package handlers

import (
	"board/database"
	"board/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetPosts(c echo.Context) error {
	rows, err := database.DB.Query("SELECT id, title, content FROM posts ORDER BY id DESC")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var post models.Post
		if err := rows.Scan(&post.ID, &post.Title, &post.Content); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		posts = append(posts, post)
	}
	return c.JSON(http.StatusOK, posts)
}

func GetPost(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	
	var post models.Post
	err := database.DB.QueryRow("SELECT id, title, content FROM posts WHERE id = $1", id).
		Scan(&post.ID, &post.Title, &post.Content)
	
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Post not found"})
	}
	
	return c.JSON(http.StatusOK, post)
}

func CreatePost(c echo.Context) error {
	post := new(models.Post)
	if err := c.Bind(post); err != nil {
		return err
	}

	err := database.DB.QueryRow(
		"INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id",
		post.Title, post.Content,
	).Scan(&post.ID)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, post)
}

func UpdatePost(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	post := new(models.Post)
	if err := c.Bind(post); err != nil {
		return err
	}

	result, err := database.DB.Exec(
		"UPDATE posts SET title = $1, content = $2 WHERE id = $3",
		post.Title, post.Content, id,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Post not found"})
	}

	post.ID = id
	return c.JSON(http.StatusOK, post)
}

func DeletePost(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	
	result, err := database.DB.Exec("DELETE FROM posts WHERE id = $1", id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Post not found"})
	}

	return c.NoContent(http.StatusNoContent)
}

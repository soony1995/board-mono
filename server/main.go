package main

import (
	"board/database"
	"board/handlers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// 데이터베이스 초기화
	database.InitDB()

	// Echo 인스턴스 생성
	e := echo.New()

	// 미들웨어 설정
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	// 라우트 설정
	e.GET("/posts", handlers.GetPosts)
	e.GET("/posts/:id", handlers.GetPost)
	e.POST("/posts", handlers.CreatePost)
	e.PUT("/posts/:id", handlers.UpdatePost)
	e.DELETE("/posts/:id", handlers.DeletePost)

	// 서버 시작
	e.Logger.Fatal(e.Start(":8080"))
}

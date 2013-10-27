canvas = document.getElementById("canvas")
context = canvas.getContext("2d")
width = canvas.width = window.innerWidth
height = canvas.height = window.innerHeight
frameRate = 20

balls = []

for i in [5..30]
  balls.push new Ball({
  maxWidth: width
  maxHeight: height
  direction: 30 + i
  speed: 5 + i
  })

setInterval (->

  context.clearRect(0, 0, width, height)
  balls.forEach (ball) ->
    ball.move()
    ball.draw(context)

  ), frameRate

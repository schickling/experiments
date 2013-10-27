class window.Ball

  constructor: (options) ->
    @maxWidth = options.maxWidth || 0
    @maxHeight = options.maxHeight || 0
    @radius = options.radius || 10
    @speed = options.speed || 5
    @position = options.position || x: @maxWidth / 2, y: @maxHeight / 2
    @direction = options.direction || 0 # in degrees

  draw: (context) ->
    context.beginPath()
    context.arc(@position.x, @position.y, @radius, 0, Math.PI*2, true)
    context.closePath()
    context.fill()

  move: ->
    if @position.y - @radius <= 0
      @direction = 360 - @direction
    else if @position.y + @radius >= @maxHeight
      @direction = 360 - @direction
    else if @position.x - @radius <= 0
      @direction = 180 - @direction
    else if @position.x + @radius >= @maxWidth
      @direction = 180 - @direction

    @position.x += Math.cos(@direction * Math.PI / 180) * @speed
    @position.y -= Math.sin(@direction * Math.PI / 180) * @speed
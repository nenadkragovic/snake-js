class ListNode {
    constructor(data, prev = null, next = null) {
        this.data = data
        this.prev = prev
        this.next = next
    }
}

class LinkedList {
    constructor(head = null) {
        this.head = head
        this.tail = head;
    }

    size() {
        let count = 0;
        let node = this.head;
        while (node) {
            count++;
            node = node.next
        }
        return count;
    }

    clear() {
        this.head = null;
    }

    getLast() {
        let lastNode = this.head;
        if (lastNode) {
            while (lastNode.next) {
                lastNode = lastNode.next
            }
        }
        return lastNode
    }

    getFirst() {
        return this.head;
    }

    addToHead(data) {
        if (this.head == null)
        {
            this.head = this.tail = new ListNode(data);
            return;
        }
        this.head.prev = new ListNode(data, 0, this.head);
        this.head = this.head.prev;
    }

    addToTail(data) {
        if (this.head == null)
        {
            this.head = this.tail = new ListNode(data);
            return;
        }
        this.tail.next = new ListNode(data, this.tail, null);
        this.tail = this.tail.prev;
    }

    removeFromHead() {
        this.head = this.head.next;
        this.head.prev = null;
    }

    removeFromTail(){
        this.tail = this.tail.prev;
        this.tail.next = null;
    }
}

class SnakeNodeData {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor(fieldSize) {
        this.field_size = fieldSize;
        this.m = 0;
        this.n = 0;
        this.snake = null;
        this.moving_direction = 2; // 0 - right, 1 - left, 2 - down, 3 - up
        this.movingInterval = null;
		this.score = 0;
    }

    init() {
        var table = document.getElementById("table");
		table.innerHTML = "";
        this.m = 0;
        this.n = 0;
        this.snake = null;
        this.moving_direction = 2; // 0 - right, 1 - left, 2 - down, 3 - up
        this.movingInterval = null;
		this.score = 0;
        var tableWidth = table.clientWidth;
        var tableHeight = table.clientHeight;
        this.m = Math.round(tableWidth/this.field_size) - 1;
        this.n = Math.round(tableHeight/this.field_size) - 1;


        for (let i = 0; i < this.n; i++) {
            for (let j=0; j < this.m; j++) {
                let field = document.createElement("div");
                field.className = "field";
                field.style.width = this.field_size + "px";
                field.style.height = this.field_size + "px";
                field.id = `field-${i}-${j}`;
                // field.innerHTML = `${i},${j}`;
                table.appendChild(field);
            }
            let newRow = document.createElement("br");
            newRow.style = "clear:both";
            table.appendChild(newRow);
        }

        this.generateFood();
        this.generateInitialSnake();
        this.renderSnake();

        this.movingInterval = setInterval(() => {
            this.moveSnake();
        }, 70);
    }

    generateFood() {
        while (true) {
            var x = Math.floor(Math.random() * this.n);
            var y = Math.floor(Math.random() * this.m);

            let generatedField = document.getElementById(`field-${x}-${y}`);

            if (generatedField?.classList.contains('snakePart'))
                continue;

            generatedField.classList.add('food');
            break;
        }
    }

    generateInitialSnake() {
        this.snake = new LinkedList();
        this.snake.addToHead(new SnakeNodeData(0, 4));
        this.snake.addToHead(new SnakeNodeData(0, 3));
        this.snake.addToHead(new SnakeNodeData(0, 2));
        this.snake.addToHead(new SnakeNodeData(0, 1));
    }

    renderSnake() {
        var elems = document.querySelectorAll(".snakePart");

        [].forEach.call(elems, function(el) {
            el.classList.remove("snakePart");
        });

        let lastNode = this.snake.getFirst();
        if (lastNode) {
            while (lastNode) {
                // render
                document.getElementById(`field-${lastNode.data.x}-${lastNode.data.y}`)?.classList.add('snakePart');
                // /render
                lastNode = lastNode.next
            }
        }
    }

    moveSnake() {
        let head  = this.snake.getFirst();
        if (head) {
            let x = head.data.x;
            let y = head.data.y;
            switch (this.moving_direction) {
                case 0: y++; break;
                case 1: y--; break;
                case 2: x++; break;
                case 3: x--; break;
            }

            if (x < 0 || x >= this.n || y < 0 || y >= this.m ||
                document.getElementById(`field-${x}-${y}`)?.classList.contains('snakePart')) {
                clearInterval(this.movingInterval);
				if(confirm(`Izgubio si decko! Imas ${this.score} poena. Oces li opet?`)){
					this.init();
				}
                return;
            }

            this.snake.addToHead(new SnakeNodeData(x, y));

            if (document.getElementById(`field-${x}-${y}`)?.classList.contains('food')) {
                var elems = document.querySelectorAll(".food");

                [].forEach.call(elems, function(el) {
                    el.classList.remove("food");
                });

                this.generateFood();
				this.score ++;
            }
            else
            {
                this.snake.removeFromTail();
            }
            this.renderSnake();
        }
    }

	changeDirection(direction) {
        let head = this.snake.getFirst();
		switch (direction) {
			case 'ArrowRight': if (!document.getElementById(`field-${head.data.x}-${head.data.y + 1}`)?.classList.contains('snakePart')) snake.moving_direction = 0; break;
			case 'ArrowLeft': if (!document.getElementById(`field-${head.data.x }-${head.data.y - 1}`)?.classList.contains('snakePart')) snake.moving_direction = 1; break;
			case 'ArrowDown': if (!document.getElementById(`field-${head.data.x + 1}-${head.data.y}`)?.classList.contains('snakePart'))snake.moving_direction = 2; break;
			case 'ArrowUp': if (!document.getElementById(`field-${head.data.x -1 }-${head.data.y}`)?.classList.contains('snakePart')) snake.moving_direction = 3; break;
		}
	}
};

let snake = new Snake(50);

document.addEventListener('keydown', (event) => {
    var code = event.code;
    snake.changeDirection(code);
  }, false);

snake.init();
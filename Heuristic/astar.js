class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => a.priority - b.priority); // Sắp xếp theo priority nhỏ nhất
    }

    dequeue() {
        return this.elements.shift().item;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

// Tính heuristic (Khoảng cách Manhattan)
function heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// Thuật toán A*
function aStar(grid, start, goal) {
    const rows = grid.length;
    const cols = grid[0].length;
    const openSet = new PriorityQueue();
    openSet.enqueue(start, 0);

    const cameFrom = new Map();
    const gScore = new Map();
    gScore.set(start.toString(), 0);

    const fScore = new Map();
    fScore.set(start.toString(), heuristic(start, goal));

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();

        if (current[0] === goal[0] && current[1] === goal[1]) {
            // Truy vết đường đi ngược lại từ điểm đích
            let path = [];
            let temp = current;
            while (cameFrom.has(temp.toString())) {
                path.push(temp);
                temp = cameFrom.get(temp.toString());
            }
            path.push(start);
            return path.reverse(); // Trả về đường đi từ start -> goal
        }

        const [x, y] = current;
        const neighbors = [
            [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1] // 4 hướng di chuyển
        ];

        for (let neighbor of neighbors) {
            const [nx, ny] = neighbor;

            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] === 0) { // Chỉ đi qua ô có giá trị 0
                const tempG = gScore.get(current.toString()) + 1;

                if (!gScore.has(neighbor.toString()) || tempG < gScore.get(neighbor.toString())) {
                    cameFrom.set(neighbor.toString(), current);
                    gScore.set(neighbor.toString(), tempG);
                    fScore.set(neighbor.toString(), tempG + heuristic(neighbor, goal));
                    openSet.enqueue(neighbor, fScore.get(neighbor.toString()));
                }
            }
        }
    }

    return []; // Không tìm thấy đường đi
}

// 🏙️ Ví dụ sử dụng thuật toán A*
const cityMap = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0]
];

const start = [0, 0];  // Điểm xuất phát
const goal = [4, 4];   // Điểm đích
const shortestPath = aStar(cityMap, start, goal);
console.log("Đường đi ngắn nhất:", shortestPath);

export function User(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);

    
}
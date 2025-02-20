export interface Task {
    id?: number;
    title: string;
    description: string;
    fecha_vencimiento: Date;
    estado: boolean | number;  
}
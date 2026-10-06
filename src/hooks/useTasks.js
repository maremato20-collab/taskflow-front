import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiFetch } from "../services/api";

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
     
      const response = await apiFetch(`/tasks/${projectId}`);
     
      setTasks(response.data?.items || response.data || []);
      toast.success('Lista de tareas sincronizada');
    } catch (err) {
      const msg = err.message || 'Error al cargar las tareas';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);


  useEffect(() => {
    let ignore = false;
    const loadInitialTasks = async () => {
      if (!projectId) {
        if (!ignore) setIsLoading(false);
        return;
      }
      try {
        const response = await apiFetch(`/tasks/${projectId}`);
        if (!ignore) setTasks(response.data?.items || response.data || []);
      } catch (err) {
        if (!ignore) setError(err.message || 'Error al cargar las tareas');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    loadInitialTasks();
    return () => { ignore = true; };
  }, [projectId]);


  const addTask = async (data) => {
    try {
      const response = await apiFetch(`/tasks/${projectId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const newTask = response.data || response;
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Tarea creada con éxito');
      return newTask;
    } catch (err) {
      toast.error(err.message || 'Error al crear la tarea');
      throw err;
    }
  };

 
  const toggleTask = async (id) => {
    try {
      const currentTask = tasks.find((t) => t.id === id);
      const isCompleted = currentTask?.completed;
      let response;

      if (!isCompleted) {
        response = await apiFetch(`/tasks/${id}/complete`, { method: 'PATCH' });
      } else {
        response = await apiFetch(`/tasks/${id}`, { 
          method: 'PATCH', 
          body: JSON.stringify({ completed: false }) 
        });
      }

      const updatedTask = response.data || response;
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      
      if (!isCompleted) toast.success('¡Tarea completada!');
      else toast.info('Tarea marcada como pendiente');
    } catch (err) {
      toast.error(err.message || 'Error al cambiar estado');
    }
  };

  const editTask = async (id, data) => {
    try {
      const response = await apiFetch(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      const updatedTask = response.data || response;
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      toast.success('Tarea actualizada correctamente');
      return updatedTask;
    } catch (err) {
      toast.error(err.message || 'Error al actualizar tarea');
      throw err;
    }
  };

  const removeTask = async (id) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Tarea eliminada del sistema');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar tarea');
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  };
}
import * as SQLite from 'expo-sqlite';

// abrindo a conexao com o banco de dados local SQLite
const db = SQLite.openDatabase('TranDx.db');

// Cria uma nova tabela se ela nao existir
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descricao TEXT, dataInicio DATE, dataTermino DATE, categoria TEXT, dia INT)',
      [],
      (_, error) => {
        if (error) {
          console.log('Error creating table: ', error);
        }
      }
    );
  });
};
export const select = (dia: number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tarefas WHERE dia = ?',
        [dia],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });

};
export const selectCategoria = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT categoria FROM tarefas',
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });

};
export const selectCategoriafilter = (dia: number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT categoria FROM tarefas WHERE dia = ?',
        [dia],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });

};
export const selectTarefaCategoria = (dia: number, categoria: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tarefas WHERE dia = ? AND categoria = ?',
        [dia,  categoria],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });

};

// adicinauma nova tarefa ao banco de dados
export const addTarefa = (titulo: string, descricao: string, dataInicio: Date, dataTermino: Date, categoria: string,dia: number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO tarefas (titulo, descricao, dataInicio, dataTermino, categoria, dia) VALUES (?, ?, ?, ?, ?,?)',
        [titulo, descricao, dataInicio.toISOString(), dataTermino.toISOString(), categoria, dia],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

// Pega todas as tarefas do banco de dados
export const getAllTarefas = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tarefas',
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

// Atualizar um tarefa existente
export const updateTarefa = (id: number, titulo: string, descricao: string, dataInicio: Date, dataTermino: Date, categoria: string, dia: number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE tarefas SET titulo = ?, descricao = ?, dataInicio = ?, dataTermino = ?, categoria = ?, dia = ? WHERE id = ?',
        [titulo, descricao, dataInicio.toISOString(), dataTermino.toISOString(), categoria,dia, id],
        (_, { rowsAffected }) => {
          resolve(rowsAffected > 0);
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

// Apagar uma tarefa existente no banco de dados
export const deleteTarefa = (id: number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM tarefas WHERE id = ?',
        [id],
        (_, { rowsAffected }) => {
          resolve(rowsAffected > 0);
        },
        (_, error) => {
          reject(error);
                  return true;
        }
      );
    });
  });
};

// section
const todoText = document.querySelector('#todo-text')
const addBtn = document.querySelector('#add-todo')
const todoList = document.querySelector('#todo-list')
let todoItemsList = []
const TODO_LIST_LS_KEY = 'todoList'

const addToLocalStorage = item => {
  if (!isValidItem(item)) return

  todoItemsList.push(item)

  // add to local storage
  localStorage.setItem(TODO_LIST_LS_KEY, JSON.stringify(todoItemsList))
}

const removeFromLocalStorage = todoItemId => {
  const localStorageListStr = localStorage.getItem(TODO_LIST_LS_KEY)
  const localStorageListArr = JSON.parse(localStorageListStr)
  const filteredItems = localStorageListArr.filter(
    item => item.id !== todoItemId
  )
  localStorage.setItem(TODO_LIST_LS_KEY, JSON.stringify(filteredItems))
}

const toggleItemStatusInLocalStorage = todoItemId => {
  const localStorageListStr = localStorage.getItem(TODO_LIST_LS_KEY)
  const localStorageListArr = JSON.parse(localStorageListStr)

  const index = localStorageListArr.findIndex(item => item.id === todoItemId)

  if (index !== -1) {
    localStorageListArr[index].isComplete =
      !localStorageListArr[index].isComplete
  }

  localStorage.setItem(TODO_LIST_LS_KEY, JSON.stringify(localStorageListArr))
}

const updateItemTextInLocalStorage = (todoItemId, newUserText) => {
  const localStorageListStr = localStorage.getItem(TODO_LIST_LS_KEY)
  const localStorageListArr = JSON.parse(localStorageListStr)
  const index = localStorageListArr.findIndex(item => item.id === todoItemId)

  if (index !== -1) {
    localStorageListArr[index].todoText = newUserText
  }

  localStorage.setItem(TODO_LIST_LS_KEY, JSON.stringify(localStorageListArr))
}

const isValidItem = item => {
  if (typeof item !== 'object') return false
  if (!item.id || typeof item.id !== 'string') return false
  if (typeof item.isComplete !== 'boolean') return false
  if (!item.todoText || typeof item.todoText !== 'string') return false

  return true
}

const handleCreateTodo = item => {
  if (!isValidItem(item)) return

  // create elements dynamically
  // LI
  const todoListItem = document.createElement('li')

  // Label
  const listItemLabel = document.createElement('label')

  // Checkbox in Label
  const listItemCheckbox = document.createElement('input')
  listItemCheckbox.setAttribute('type', 'checkbox')
  listItemCheckbox.checked = item.isComplete

  // Span in Label
  const listItemLabelSpan = document.createElement('span')
  listItemLabelSpan.style.textDecorationLine = item.isComplete
    ? 'line-through'
    : 'none'
  // Delete Button
  const listItemDeleteButton = document.createElement('button')

  // Icon Span
  const trashIcon = document.createElement('span')
  trashIcon.classList.add('material-symbols-outlined')
  trashIcon.innerText = 'delete'

  // creating mark up structure
  todoList.appendChild(todoListItem)
  listItemLabel.appendChild(listItemCheckbox)
  listItemLabel.appendChild(listItemLabelSpan)
  todoListItem.appendChild(listItemLabel)
  todoListItem.appendChild(listItemDeleteButton)
  listItemDeleteButton.appendChild(trashIcon)

  // creating event listeners
  listItemCheckbox.addEventListener('click', event => {
    listItemLabelSpan.style.textDecorationLine = event.target.checked
      ? 'line-through'
      : 'none'

    toggleItemStatusInLocalStorage(item.id)
  })

  listItemDeleteButton.addEventListener('click', () => {
    todoListItem.remove()
    removeFromLocalStorage(item.id)
  })

  listItemLabelSpan.addEventListener('dblclick', () => {
    listItemLabelSpan.setAttribute('contenteditable', true)
  })

  listItemLabelSpan.addEventListener('blur', () => {
    listItemLabelSpan.removeAttribute('contenteditable')
    updateItemTextInLocalStorage(item.id, listItemLabelSpan.innerText)
  })

  listItemLabelSpan.innerText = item.todoText
}
// listening to an event
addBtn.addEventListener('click', evt => {
  evt.preventDefault()
  const todoItemId = crypto.randomUUID()
  const userText = todoText.value
  const newTodoItem = { id: todoItemId, isComplete: false, todoText: userText }
  handleCreateTodo(newTodoItem)
  addToLocalStorage(newTodoItem)
})

document.addEventListener('DOMContentLoaded', () => {
  try {
    const localStorageListStr = localStorage.getItem(TODO_LIST_LS_KEY)
    const localStorageListArray = JSON.parse(localStorageListStr)

    if (!Array.isArray(localStorageListArray)) return
    localStorageListArray.forEach(item => {
      handleCreateTodo(item)
    })
    todoItemsList = localStorageListArray
  } catch (error) {
    localStorage.removeItem(TODO_LIST_LS_KEY)
  }
})

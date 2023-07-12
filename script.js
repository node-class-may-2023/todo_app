// section
const todoText = document.querySelector('#todo-text')
const addBtn = document.querySelector('#add-todo')
const todoList = document.querySelector('#todo-list')
const resetBtn = document.querySelector('#reset')
let todoItemsList = []
const TODO_LIST_LS_KEY = 'todoList'
let TtlTimer

const saveToLocalStorage = (key, value) => {
  try {
    if (!key || !value) return
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.log(e.message)
  }
}

const addToLocalStorage = item => {
  if (!isValidItem(item)) return
  if (TtlTimer) {
    clearTimeout(TtlTimer)
  }

  todoItemsList.push(item)

  // add to local storage
  saveToLocalStorage(TODO_LIST_LS_KEY, todoItemsList)
  TtlTimer = setTimeout(() => {
    localStorage.removeItem(TODO_LIST_LS_KEY)
  }, 30000)
}

const getArrayFromLocalStorage = key => {
  try {
    const localStorageListStr = localStorage.getItem(key)
    const localStorageListArr = JSON.parse(localStorageListStr)
    if (!Array.isArray(localStorageListArr))
      throw TypeError(`local storage value for the ${key} is not of Array type`)

    return localStorageListArr
  } catch (e) {
    console.log(e.message)
    return []
  }
}

const removeFromLocalStorage = todoItemId => {
  const localStorageListArr = getArrayFromLocalStorage(TODO_LIST_LS_KEY)
  const filteredItems = localStorageListArr.filter(
    item => item.id !== todoItemId
  )
  saveToLocalStorage(TODO_LIST_LS_KEY, filteredItems)
}

const toggleItemStatusInLocalStorage = todoItemId => {
  const localStorageListArr = getArrayFromLocalStorage(TODO_LIST_LS_KEY)
  const index = localStorageListArr.findIndex(item => item.id === todoItemId)

  if (index !== -1) {
    localStorageListArr[index].isComplete =
      !localStorageListArr[index].isComplete
  }

  saveToLocalStorage(TODO_LIST_LS_KEY, localStorageListArr)
}

const updateItemTextInLocalStorage = (todoItemId, newUserText) => {
  const localStorageListArr = getArrayFromLocalStorage(TODO_LIST_LS_KEY)
  const index = localStorageListArr.findIndex(item => item.id === todoItemId)

  if (index !== -1) {
    localStorageListArr[index].todoText = newUserText
  }

  saveToLocalStorage(TODO_LIST_LS_KEY, localStorageListArr)
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
    const localStorageListArray = getArrayFromLocalStorage(TODO_LIST_LS_KEY)

    if (!Array.isArray(localStorageListArray)) return
    localStorageListArray.forEach(item => {
      handleCreateTodo(item)
    })
    todoItemsList = localStorageListArray
  } catch (error) {
    localStorage.removeItem(TODO_LIST_LS_KEY)
  }
})

resetBtn.addEventListener('click', ()=>{
	localStorage.removeItem(TODO_LIST_LS_KEY)
	todoList.innerHTML=''
	todoItemsList = []
})

// implement TTL for the todo items


// Understand the requirement
	// build a to do app
// Approach the requirement
	// List
		// status checkbox
		// item text
		// delete button
	// Form
		// add button
		// user input
// Implementation (coding)
	// implemented the common use case - happy path
	// implemented the error handling (what-if)
	// Refactor to optimize the code for readability and maintenance

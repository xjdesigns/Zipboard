import { SlButton, SlButtonGroup, SlDialog } from './shoelace'

export const DeleteDialog = ({ isOpen, itemToDelete, deleteItem, closeDelete }) => {
  const handleDelete = () => {
    deleteItem?.(itemToDelete)
    closeDelete?.()
  }

  const handleClose = () => {
    closeDelete?.()
  }

  return (
    <SlDialog label="Edit" open={isOpen} onSlAfterHide={handleClose}>
      <div className="zp-mg-bt">Are you sure you want to delete this item?</div>
      <SlButtonGroup slot="footer">
        <SlButton variant="default" size="small" onClick={handleClose}>
          Close
        </SlButton>
        <SlButton variant="primary" size="small" onClick={handleDelete}>
          Update
        </SlButton>
      </SlButtonGroup>
    </SlDialog>
  )
}

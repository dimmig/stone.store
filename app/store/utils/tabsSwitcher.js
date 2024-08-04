export const switchToFeedbackTab = () => {
  const tabs = document.querySelectorAll('.item-tabs-sections')
  if (tabs[1].classList.contains("border-white")) {
    tabs[1].classList.remove("border-white")
    tabs[1].classList.add("border-[#adacac]")
    tabs[1].classList.add("text-[#adacac]")
    tabs[0].classList.remove("border-[#adacac]")
    tabs[0].classList.add("border-white")
    tabs[0].classList.remove("text-[#adacac]")
    tabs[0].classList.add("text-white")
  }
}
export const switchToItemTab = () => {
  const tabs = document.querySelectorAll('.item-tabs-sections')
  if (tabs[0].classList.contains("border-white")) {
    tabs[0].classList.remove("border-white")
    tabs[0].classList.add("border-[#adacac]")
    tabs[0].classList.add("text-[#adacac]")
    tabs[1].classList.remove("border-[#adacac]")
    tabs[1].classList.add("border-white")
    tabs[1].classList.remove("text-[#adacac]")
    tabs[1].classList.add("text-white")
  }
}
const LandingFooter = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto text-center">
        <h3 className="font-bold text-xl">YourGoalApp</h3>
        <p className="text-gray-600 mt-2">&copy; {new Date().getFullYear()} YourGoalApp. All rights reserved.</p>
      </div>
    </footer>
  )
}

export { LandingFooter }
export default LandingFooter

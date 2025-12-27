

function App() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-primary mb-4">PB Sena</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Ambiente configurado com sucesso!
            </p>
            <div className="mt-8 flex gap-4">
                <button className="px-4 py-2 bg-primary text-white rounded-lg shadow-glow hover:bg-primary-dark transition-colors">
                    Começar
                </button>
            </div>
        </div>
    )
}

export default App

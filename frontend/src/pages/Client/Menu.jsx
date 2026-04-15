import React, { useState, useEffect } from 'react';
import menuService from '../../services/menuService';
import useCart from '../../hooks/useCart';
import { ShoppingCart, Star, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Menu = () => {
    const [plats, setPlats] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategorie, setSelectedCategorie] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    
    const { addToCart, getCartCount } = useCart();

    // Charger les plats et catégories
    useEffect(() => {
        fetchPlats();
        fetchCategories();
    }, [selectedCategorie, searchTerm]);

    const fetchPlats = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (selectedCategorie) filters.categorie = selectedCategorie;
            if (searchTerm) filters.search = searchTerm;
            filters.disponibilite = true;
            
            const data = await menuService.getPlats(filters);
            setPlats(data);
        } catch (error) {
            console.error('Erreur lors du chargement des plats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await menuService.getCategories();
            setCategories(['Tous', ...data]);
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
        }
    };

    const handleAddToCart = (plat) => {
        addToCart({
            id: plat.id,
            nom: plat.nom,
            prix: plat.prix,
            image_url: plat.image_url,
            quantite: 1
        });
        
        // Afficher notification
        setNotificationMessage(`${plat.nom} ajouté au panier !`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlats = plats.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(plats.length / itemsPerPage);

    // Étoiles de notation
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;
        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                ))}
                <span className="ml-1 text-sm text-gray-500">({rating})</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
            {/* Barre de navigation avec panier */}
            <div className="sticky top-0 z-10 bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-primary">Notre Menu</h1>
                        
                        {/* Compteur panier */}
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer" />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Barre de recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher un plat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filtre catégorie */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={selectedCategorie}
                                onChange={(e) => setSelectedCategorie(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white appearance-none cursor-pointer"
                            >
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat === 'Tous' ? '' : cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grille des plats */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentPlats.map((plat) => (
                                <div key={plat.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    {/* Image */}
                                    <div className="h-48 overflow-hidden bg-gradient-to-r from-primary-light to-primary">
                                        {plat.image_url ? (
                                            <img src={plat.image_url} alt={plat.nom} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white text-opacity-50">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Contenu */}
                                    <div className="p-5">
                                        {/* Catégorie */}
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-orange-100 rounded-full mb-2">
                                            {plat.categorie}
                                        </span>
                                        
                                        {/* Nom et prix */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">{plat.nom}</h3>
                                            <span className="text-xl font-bold text-primary">{plat.prix.toFixed(2)}€</span>
                                        </div>
                                        
                                        {/* Description */}
                                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                            {plat.description || "Un délicieux plat préparé avec soin par nos chefs."}
                                        </p>
                                        
                                        {/* Étoiles et temps */}
                                        <div className="flex justify-between items-center mb-4">
                                            {renderStars(plat.note_moyenne || 4.5)}
                                            <span className="text-xs text-gray-400">⏱️ {plat.temps_preparation} min</span>
                                        </div>
                                        
                                        {/* Bouton ajouter */}
                                        <button
                                            onClick={() => handleAddToCart(plat)}
                                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Ajouter au panier
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            currentPage === i + 1
                                                ? 'bg-primary text-white'
                                                : 'border hover:bg-gray-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {plats.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">Aucun plat trouvé</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Notification toast */}
            {showNotification && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-50">
                    {notificationMessage}
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Menu;
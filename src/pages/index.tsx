import type { NextPage } from "next";
import Layout from "@/components/Layout";
import GalleryLatest from "@/components/gallery/Latest";
import ShopLatest from "@/components/shop/Latest";

const Home: NextPage = () => {
  const pageData = {
    title: "Home",
    description: "",
  };
  
  return (
    <Layout data={pageData}>
      <main>
        <div
          className="relative pt-16 pb-32 flex content-center items-center justify-center"
          style={{minHeight: "75vh"}}
        >
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{backgroundImage: "url('/images/bg-masthead.jpg')"}}
          >
            <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-black"></span>
          </div>
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-white font-semibold text-5xl font-oswald">
                    BOUND IN WICKEDRY
                  </h1>
                  <p className="mt-4 text-lg text-secondary font-shadows">
                    What's your kink?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-secondary fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>

        <section className="pb-20 bg-secondary -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-primary">
                      <i className="fas fa-photo-film"></i>
                    </div>
                    <h6 className="text-xl font-semibold text-secondary font-oswald">
                      GALLERY
                    </h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      Immerse yourself in a feast of sensual delights. Indulge in photography, videos, and artwork, celebrating the beauty of human sensuality. Let your imagination run wild.
                    </p>
                  </div>
                </div>
              </div>
              
              
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-primary">
                      <i className="fas fa-users-between-lines"></i>
                    </div>
                    <h6 className="text-xl font-semibold font-oswald text-secondary">FORUM</h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      Engage in conversations, explore fantasies, and receive advice in our inclusive forum. Connect with like-minded individuals, and embrace a judgment-free space designed to ignite your desires.
                    </p>
                  </div>
                </div>
              </div>

              

              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-primary">
                      <i className="fas fa-cart-shopping"></i>
                    </div>
                    <h6 className="text-xl font-semibold font-oswald text-secondary">
                      SHOP
                    </h6>
                    <p className="mt-2 mb-4 text-gray-600">
                      Discover a selection of products, from luxurious lingerie to cutting-edge toys, carefully chosen to enhance your experience. With discreet packaging, explore a world of pleasure and fantasies.
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <div className="flex flex-wrap items-center mt-32">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  Welcome!
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-secondary-content">
                  Welcome to BoundInWickedry.com, where pleasure meets community. Discover a world of sensual delights through our unique features designed to ignite your desires. Engage in passionate conversations, explore captivating imagery, and indulge in a curated selection of adult products. Join us today and unlock a universe of erotic possibilities.
                </p>
                <a
                  href="/user/register/"
                  className="font-bold text-gray-200 mt-8"
                >
                  Join Now!
                </a>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg">
                  <img
                    alt="..."
                    src="/images/welcome.jpg"
                    className="w-full align-middle rounded-t-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="pb-20 bg-secondary">
          <div className="container mx-auto px-4">
            <GalleryLatest />
          </div>
        </section>
        
        <section className="pb-20 bg-secondary">
          <div className="container mx-auto px-4">
            <ShopLatest />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
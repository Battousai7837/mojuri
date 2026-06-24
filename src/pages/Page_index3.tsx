import { useRef } from 'react';
import { usePageScripts } from '../usePageScripts';

const HTML = `
		<div id="page" class="hfeed page-wrapper">
			<header id="site-header" class="site-header header-v3">
				<div class="header-mobile">
					<div class="section-padding">
						<div class="section-container">
							<div class="row">
								<div class="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3 header-left">
									<div class="navbar-header">
										<button type="button" id="show-megamenu" class="navbar-toggle"></button>
									</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6 header-center">
									<div class="site-logo">
										<a href="index3.html">
											<img width="400" height="79" src="media/logo.png" alt="Mojuri – Jewelry Store HTML Template" />
										</a>
									</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3 header-right">
									<div class="mojuri-topcart dropdown">
										<div class="dropdown mini-cart top-cart">
											<div class="remove-cart-shadow"></div>
											<a class="dropdown-toggle cart-icon" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												<div class="icons-cart"><i class="icon-large-paper-bag"></i><span class="cart-count">2</span></div>
											</a>
											<div class="dropdown-menu cart-popup">
												<div class="cart-empty-wrap">
													<ul class="cart-list">
														<li class="empty">
															<span>No products in the cart.</span>
															<a class="go-shop" href="shop-grid-left.html">GO TO SHOP<i aria-hidden="true" class="arrow_right"></i></a>
														</li>
													</ul>
												</div>
												<div class="cart-list-wrap">
													<ul class="cart-list ">
														<li class="mini-cart-item">
															<a href="#" class="remove" title="Remove this item"><i class="icon_close"></i></a>
															<a href="shop-details.html" class="product-image"><img width="600" height="600" src="media/product/3.jpg" alt=""></a>
															<a href="shop-details.html" class="product-name">Twin Hoops</a>
															<div class="quantity">Qty: 1</div>
															<div class="price">$150.00</div>
														</li>
														<li class="mini-cart-item">
															<a href="#" class="remove" title="Remove this item"><i class="icon_close"></i></a>													
															<a href="shop-details.html" class="product-image"><img width="600" height="600" src="media/product/1.jpg" alt=""></a>
															<a href="shop-details.html" class="product-name">Medium Flat Hoops</a>
															<div class="quantity">Qty: 1</div>
															<div class="price">$100.00</div>
														</li>
													</ul>
													<div class="total-cart">
														<div class="title-total">Total: </div>
														<div class="total-price"><span>$250.00</span></div>
													</div>
													<div class="free-ship">
														<div class="title-ship">Buy <strong>$400</strong> more to enjoy <strong>FREE Shipping</strong></div>
														<div class="total-percent"><div class="percent" style="width:20%"></div></div>
													</div>
													<div class="buttons">
														<a href="shop-cart.html" class="button btn view-cart btn-primary">View cart</a>
														<a href="shop-checkout.html" class="button btn checkout btn-default">Check out</a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="header-mobile-fixed">
						<!-- Shop -->
						<div class="shop-page">
							<a href="shop-grid-left.html"><i class="wpb-icon-shop"></i></a>
						</div>

						<!-- Login -->
						<div class="my-account">
							<div class="login-header">
								<a href="page-my-account.html"><i class="wpb-icon-user"></i></a>
							</div>
						</div>

						<!-- Search -->
						<div class="search-box">
							<div class="search-toggle"><i class="wpb-icon-magnifying-glass"></i></div>
						</div>

						<!-- Wishlist -->
						<div class="wishlist-box">
							<a href="shop-wishlist.html"><i class="wpb-icon-heart"></i></a>
						</div>
					</div>
				</div>

				<div class="header-desktop">
					<div class="header-top">
						<div class="section-padding">
							<div class="section-container large p-l-r">
								<div class="row">
									<div class="col-xl-2 col-lg-4 col-md-12 col-sm-12 col-12 header-left">
										<div class="header-page-link">
											<!-- Search -->
											<div class="search-box">
												<div class="search-toggle"><i class="icon-search"></i></div>
											</div>
										</div>
									</div>

									<div class="col-xl-8 col-lg-4 col-md-12 col-sm-12 col-12 text-center header-center">
										<div class="site-logo">
											<a href="index3.html">
												<img width="400" height="80" src="media/logo.png" alt="Mojuri – Jewelry Store HTML Template" />
											</a>
										</div>
									</div>

									<div class="col-xl-2 col-lg-4 col-md-12 col-sm-12 col-12 header-right">
										<div class="header-page-link">
											<!-- Login -->
											<div class="login-header icon">
												<a class="active-login" href="#"><i class="icon-user"></i></a>
												<div class="form-login-register">
													<div class="box-form-login">
														<div class="active-login"></div>
														<div class="box-content">
															<div class="form-login active">
																<form id="login_ajax" method="post" class="login">
																	<h2>Sign in</h2>
																	<p class="status"></p>
																	<div class="content">
																		<div class="username">
																			<input type="text" required="required" class="input-text" name="username" id="username" placeholder="Your name"/>
																		</div>
																		<div class="password">
																			<input class="input-text" required="required" type="password" name="password" id="password" placeholder="Password"/>
																		</div>
																		<div class="rememberme-lost">
																			<div class="rememberme">
																				<input name="rememberme" type="checkbox" id="rememberme" value="forever"/>
																				<label for="rememberme" class="inline">Remember me</label>
																			</div>
																			<div class="lost_password">
																				<a href="forgot-password.html">Lost your password?</a>
																			</div>
																		</div>
																		<div class="button-login">
																			<input type="submit" class="button" name="login" value="Login"/>
																		</div>
																		<div class="button-next-reregister">Create An Account</div>
																	</div>						
																</form>
															</div>
															<div class="form-register">
																<form method="post" class="register">
																	<h2>REGISTER</h2>
																	<div class="content">
																		<div class="email">
																			<input type="email" class="input-text" placeholder="Email" name="email" id="reg_email" value=""/>
																		</div>
																		<div class="password">
																			<input type="password" class="input-text" placeholder="Password" name="password" id="reg_password"/>
																		</div>															
																		<div class="button-register">
																			<input type="submit" class="button" name="register" value="Register"/>
																		</div>
																		<div class="button-next-login">Already has an account</div>
																	</div>
																</form>
															</div>
														</div>
													</div>
												</div>
											</div>
											
											<!-- Wishlist -->
											<div class="wishlist-box">
												<a href="shop-wishlist.html"><i class="icon-heart"></i></a>
												<span class="count-wishlist">1</span>
											</div>
											
											<!-- Cart -->
											<div class="mojuri-topcart dropdown light">
												<div class="dropdown mini-cart top-cart">
													<div class="remove-cart-shadow"></div>
													<a class="dropdown-toggle cart-icon" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
														<div class="icons-cart"><i class="icon-large-paper-bag"></i><span class="cart-count">2</span></div>
													</a>
													<div class="dropdown-menu cart-popup">
														<div class="cart-empty-wrap">
															<ul class="cart-list">
																<li class="empty">
																	<span>No products in the cart.</span>
																	<a class="go-shop" href="shop-grid-left.html">GO TO SHOP<i aria-hidden="true" class="arrow_right"></i></a>
																</li>
															</ul>
														</div>
														<div class="cart-list-wrap">
															<ul class="cart-list ">
																<li class="mini-cart-item">
																	<a href="#" class="remove" title="Remove this item"><i class="icon_close"></i></a>
																	<a href="shop-details.html" class="product-image"><img width="600" height="600" src="media/product/3.jpg" alt=""></a>
																	<a href="shop-details.html" class="product-name">Twin Hoops</a>		
																	<div class="quantity">Qty: 1</div>
																	<div class="price">$150.00</div>
																</li>
																<li class="mini-cart-item">
																	<a href="#" class="remove" title="Remove this item"><i class="icon_close"></i></a>													
																	<a href="shop-details.html" class="product-image"><img width="600" height="600" src="media/product/1.jpg" alt=""></a>
																	<a href="shop-details.html" class="product-name">Medium Flat Hoops</a>
																	<div class="quantity">Qty: 1</div>
																	<div class="price">$100.00</div>						
																</li>
															</ul>
															<div class="total-cart">
																<div class="title-total">Total: </div>
																<div class="total-price"><span>$250.00</span></div>
															</div>
															<div class="free-ship">
																<div class="title-ship">Buy <strong>$400</strong> more to enjoy <strong>FREE Shipping</strong></div>
																<div class="total-percent"><div class="percent" style="width:20%"></div></div>
															</div>
															<div class="buttons">
																<a href="shop-cart.html" class="button btn view-cart btn-primary">View cart</a>
																<a href="shop-checkout.html" class="button btn checkout btn-default">Check out</a>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="header-middle text-center color-white">
						<div class="site-navigation">
							<nav id="main-navigation">
								<ul id="menu-main-menu" class="menu">
									<li class="level-0 menu-item menu-item-has-children current-menu-item">
										<a href="index.html"><span class="menu-item-text">Home</span></a>
										<ul class="sub-menu">
											<li>
												<a href="index.html"><span class="menu-item-text">Home Clean</span></a>
											</li>
											<li>
												<a href="index2.html"><span class="menu-item-text">Home Collection</span></a>
											</li>
											<li>
												<a href="index3.html"><span class="menu-item-text">Home Minimal</span></a>
											</li>
											<li>
												<a href="index4.html"><span class="menu-item-text">Home Modern</span></a>
											</li>
											<li>
												<a href="index5.html"><span class="menu-item-text">Home Parallax</span></a>
											</li>
											<li>
												<a href="index6.html"><span class="menu-item-text">Home Strong</span></a>
											</li>
											<li>
												<a href="index7.html"><span class="menu-item-text">Home Style</span></a>
											</li>
											<li>
												<a href="index8.html"><span class="menu-item-text">Home Unique</span></a>
											</li>
										</ul>
									</li>
									<li class="level-0 menu-item menu-item-has-children">
										<a href="shop-grid-left.html"><span class="menu-item-text">Shop</span></a>
										<ul class="sub-menu">
											<li class="level-1 menu-item menu-item-has-children">
												<a href="shop-grid-left.html"><span class="menu-item-text">Shop - Products</span></a>
												<ul class="sub-menu">
													<li>
														<a href="shop-grid-left.html"><span class="menu-item-text">Shop Grid - Left Sidebar</span></a>
													</li>
													<li>
														<a href="shop-list-left.html"><span class="menu-item-text">Shop List - Left Sidebar</span></a>
													</li>
													<li>
														<a href="shop-grid-right.html"><span class="menu-item-text">Shop Grid - Right Sidebar</span></a>
													</li>
													<li>
														<a href="shop-list-right.html"><span class="menu-item-text">Shop List - Right Sidebar</span></a>
													</li>
													<li>
														<a href="shop-grid-fullwidth.html"><span class="menu-item-text">Shop Grid - No Sidebar</span></a>
													</li>
												</ul>
											</li>
											<li>
												<a href="shop-details.html"><span class="menu-item-text">Shop Details</span></a>
											</li>
											<li>
												<a href="shop-cart.html"><span class="menu-item-text">Shop - Cart</span></a>
											</li>
											<li>
												<a href="shop-checkout.html"><span class="menu-item-text">Shop - Checkout</span></a>
											</li>
											<li>
												<a href="shop-wishlist.html"><span class="menu-item-text">Shop - Wishlist</span></a>
											</li>
										</ul>
									</li>
									<li class="level-0 menu-item menu-item-has-children mega-menu mega-menu-fullwidth align-center">
										<a href="blog-grid-left.html"><span class="menu-item-text">Blog</span></a>
										<div class="sub-menu">
											<div class="row">
												<div class="col-md-5">
													<div class="menu-section">
														<h2 class="sub-menu-title">Blog Category</h2>
														<ul class="menu-list">
															<li>
																<a href="blog-grid-left.html"><span class="menu-item-text">Blog Grid - Left Sidebar</span></a>
															</li>
															<li>
																<a href="blog-grid-right.html"><span class="menu-item-text">Blog Grid - Right Sidebar</span></a>
															</li>
															<li>
																<a href="blog-list-left.html"><span class="menu-item-text">Blog List - Left Sidebar</span></a>
															</li>
															<li>
																<a href="blog-list-right.html"><span class="menu-item-text">Blog List - Right Sidebar</span></a>
															</li>
															<li>
																<a href="blog-grid-fullwidth.html"><span class="menu-item-text">Blog Grid - No Sidebar</span></a>
															</li>
														</ul>
													</div>

													<div class="menu-section">
														<h2 class="sub-menu-title">Blog Details</h2>
														<ul class="menu-list">
															<li>
																<a href="blog-details-left.html"><span class="menu-item-text">Blog Details - Left Sidebar</span></a>
															</li>
															<li>
																<a href="blog-details-right.html"><span class="menu-item-text">Blog Details - Right Sidebar</span></a>
															</li>
															<li>
																<a href="blog-details-fullwidth.html"><span class="menu-item-text">Blog Details - No Sidebar</span></a>
															</li>
														</ul>
													</div>
												</div>
												<div class="col-md-7">
													<div class="menu-section">
														<h2 class="sub-menu-title">Recent Posts</h2>
														<div class="block block-posts recent-posts p-t-5">
															<ul class="posts-list">
																<li class="post-item">
																	<a href="blog-details-right.html" class="post-image">
																		<img src="media/blog/1.jpg">
																	</a>
																	<div class="post-content">
																		<h2 class="post-title">
																			<a href="blog-details-right.html">
																				Bridial Fair Collections 2023
																			</a>
																		</h2>
																		<div class="post-time">
																			<span class="post-date">May 30, 2022</span>
																			<span class="post-comment">4 Comments</span>
																		</div>
																	</div>
																</li>
																<li class="post-item">
																	<a href="blog-details-right.html" class="post-image">
																		<img src="media/blog/2.jpg">
																	</a>
																	<div class="post-content">
																		<h2 class="post-title">
																			<a href="blog-details-right.html">
																				Our Sterling Silver
																			</a>
																		</h2>
																		<div class="post-time">
																			<span class="post-date">Aug 24, 2022</span>
																			<span class="post-comment">2 Comments</span>
																		</div>
																	</div>
																</li>
																<li class="post-item">
																	<a href="blog-details-right.html" class="post-image">
																		<img src="media/blog/3.jpg">
																	</a>
																	<div class="post-content">
																		<h2 class="post-title">
																			<a href="blog-details-right.html">
																				Kitchen Inspired On Japanese
																			</a>
																		</h2>
																		<div class="post-time">
																			<span class="post-date">Dec 06, 2022</span>
																			<span class="post-comment">1 Comment</span>
																		</div>
																	</div>
																</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
										</div>
									</li>
									<li class="level-0 menu-item menu-item-has-children">
										<a href="#"><span class="menu-item-text">Pages</span></a>
										<ul class="sub-menu">
											<li>
												<a href="page-login.html"><span class="menu-item-text">Login / Register</span></a>
											</li>
											<li>
												<a href="page-forgot-password.html"><span class="menu-item-text">Forgot Password</span></a>
											</li>
											<li>
												<a href="page-my-account.html"><span class="menu-item-text">My Account</span></a>
											</li>
											<li>
												<a href="page-about.html"><span class="menu-item-text">About Us</span></a>
											</li>
											<li>
												<a href="page-contact.html"><span class="menu-item-text">Contact</span></a>
											</li>
											<li>
												<a href="page-faq.html"><span class="menu-item-text">FAQ</span></a>
											</li>
											<li>
												<a href="page-404.html"><span class="menu-item-text">Page 404</span></a>
											</li>
										</ul>
									</li>
									<li class="level-0 menu-item">
										<a href="page-contact.html"><span class="menu-item-text">Contact</span></a>
									</li>
								</ul>
							</nav>
						</div>
					</div>
					<div class="header-bottom">
						<div class="section-padding">
							<div class="section-container p-l-r">
								<div class="block block-feature">
									<div class="block-widget-wrap">
										<div class="row">
											<div class="col-md-4 sm-m-b-50">
												<div class="box">
													<div class="box-icon">
														<span>
															<svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"id="Layer_1"x="0px"y="0px"viewBox="0 0 512 512"style="enable-background:new 0 0 512 512;"xml:space="preserve"><g><g><path d="M509.473,256.394l-59.391-67.801c-1.937-2.21-4.733-3.479-7.672-3.479h-49.455v-41.872    c0-5.633-4.567-10.199-10.199-10.199H172.109c-5.632,0-10.199,4.566-10.199,10.199v13.762H63.818    c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h98.092v132.21h-59.046    c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h59.046v10.365c0,5.633,4.567,10.199,10.199,10.199    h21.288c4.485,16.339,19.459,28.382,37.203,28.382c17.744,0,32.718-12.043,37.204-28.382h136.089v-0.001    c4.485,16.339,19.459,28.382,37.203,28.382c17.744,0,32.718-12.043,37.204-28.382h23.502c5.632,0,10.199-4.566,10.199-10.199    v-77.261C512,260.642,511.101,258.253,509.473,256.394z M230.6,358.558c-10.026,0-18.182-8.157-18.182-18.183    s8.156-18.183,18.182-18.183s18.183,8.157,18.183,18.183S240.626,358.558,230.6,358.558z M267.802,330.176    c-4.485-16.339-19.46-28.382-37.204-28.382s-32.717,12.043-37.203,28.382h-11.089V153.44h190.247v176.736H267.802z     M441.094,358.558c-10.026,0-18.182-8.157-18.182-18.183s8.156-18.183,18.182-18.183c10.026,0,18.183,8.157,18.183,18.183    S451.121,358.558,441.094,358.558z M491.602,330.176h-13.304c-4.485-16.339-19.46-28.382-37.204-28.382    c-17.744,0-32.717,12.043-37.203,28.382h-10.939V205.512h44.831l53.818,61.437V330.176z"></path></g></g><g><g><path d="M69.261,309.611h-5.442c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h5.442    c5.632,0,10.199-4.566,10.199-10.199C79.46,314.177,74.894,309.611,69.261,309.611z"></path></g></g><g><g><path d="M119.5,232.276H10.199C4.567,232.276,0,236.842,0,242.475c0,5.633,4.567,10.199,10.199,10.199H119.5    c5.632,0,10.199-4.566,10.199-10.199C129.699,236.842,125.132,232.276,119.5,232.276z"></path></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
														</span>
													</div>
													<div class="box-title-wrap">
														<h3 class="box-title">
													 		FREE SHIPPING OVERS $60 
														</h3>
													</div>
												</div>
											</div>
											<div class="col-md-4 sm-m-b-50">
												<div class="box">
													<div class="box-icon icon-2">
														<span>
															<svg xmlns="http://www.w3.org/2000/svg" height="459pt" viewBox="-5 0 459 459.648" width="459pt"><path d="m416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0"></path><path d="m32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0"></path></svg>
														</span>
													</div>
													<div class="box-title-wrap">
														<h3 class="box-title">
													 		EASY EXCHANGES & RETURNS 
														</h3>
													</div>
												</div>
											</div>
											<div class="col-md-4">
												<div class="box">
													<div class="box-icon icon-3">
														<span>
															<svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"id="Layer_1"x="0px"y="0px"viewBox="0 0 512 512"style="enable-background:new 0 0 512 512;"xml:space="preserve"><g><g><path d="M498.946,294.959c-5.521-1.116-10.902,2.455-12.018,7.977C464.834,412.256,367.715,491.602,256,491.602    c-129.911,0-235.602-105.69-235.602-235.602S126.089,20.398,256,20.398c61.287,0,120.041,23.97,163.818,66.295h-26.361    c-5.633,0-10.199,4.566-10.199,10.199c0,5.633,4.566,10.199,10.199,10.199h51.229c5.633,0,10.199-4.566,10.199-10.199V45.664    c0-5.633-4.566-10.199-10.199-10.199c-5.633,0-10.199,4.566-10.199,10.199v26.848C386.87,26.228,322.823,0,256,0    C187.62,0,123.333,26.628,74.98,74.98C26.628,123.333,0,187.62,0,256s26.628,132.667,74.98,181.02    C123.333,485.372,187.62,512,256,512c59.438,0,117.352-20.83,163.074-58.652c45.116-37.321,76.315-89.304,87.849-146.372    C508.039,301.455,504.467,296.075,498.946,294.959z"></path></g></g><g><g><path d="M501.801,245.801c-5.633,0-10.199,4.566-10.199,10.199c0,2.281-0.033,4.585-0.098,6.848    c-0.161,5.631,4.273,10.326,9.903,10.487c0.1,0.002,0.198,0.004,0.297,0.004c5.497,0,10.031-4.376,10.19-9.907    c0.07-2.457,0.106-4.957,0.106-7.43C512,250.367,507.434,245.801,501.801,245.801z"></path></g></g><g><g><path d="M248.858,350.416H145.234v-20.14c0-43.204,109.147-65.293,109.147-135.134c0-35.082-27.286-62.369-64.644-62.369    c-34.434,0-61.07,22.739-61.07,53.924c0,9.745,3.248,13.319,9.745,13.319c7.471,0,11.369-4.548,11.369-8.771    c0-25.662,16.892-38.332,39.306-38.332c29.886,0,43.854,22.414,43.854,42.88c0,56.846-109.797,80.56-109.797,134.484v31.51    c0,5.198,5.847,8.446,10.07,8.446h115.644c4.223,0,7.796-4.872,7.796-10.071C256.654,354.964,253.081,350.416,248.858,350.416z"></path></g></g><g><g><path d="M388.538,293.893h-17.866v-62.695c0-5.523-5.523-8.121-10.72-8.121c-5.523,0-10.719,2.599-10.719,8.121v62.695h-63.669    l75.039-148.127c0.65-1.625,0.975-2.924,0.975-4.223c0-5.198-6.173-8.771-10.395-8.771c-3.898,0-7.796,1.949-10.071,6.497    l-81.535,160.797c-0.974,1.625-1.299,3.573-1.299,5.523c0,4.872,2.924,8.771,8.446,8.771h82.51v47.426    c0,5.522,5.198,8.446,10.719,8.446c5.198,0,10.72-2.924,10.72-8.446v-47.426h17.866c4.872,0,8.121-5.198,8.121-10.395    C396.658,299.091,394.059,293.893,388.538,293.893z"></path></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
														</span>
													</div>
													<div class="box-title-wrap">
														<h3 class="box-title">
													 		24/7 Free Support 
														</h3>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div id="site-main" class="site-main">
				<div id="main-content" class="main-content">
					<div id="primary" class="content-area">
						<div id="content" class="site-content" role="main">
							<section class="section m-b-30">
								<!-- Block Sliders (Layout 3) -->
								<div class="block block-sliders layout-3 auto-height nav-center">
									<div class="slick-sliders" data-autoplay="true" data-dots="true" data-nav="true" data-columns4="1" data-columns3="1" data-columns2="1" data-columns1="1" data-columns1440="1" data-columns="1">
										<div class="item slick-slide">
											<div class="item-content">
												<div class="content-image">
													<img width="1920" height="671" src="media/slider/3-1.jpg" alt="Image Slider">
												</div>
												<div class="item-info horizontal-start vertical-middle">
													<div class="content">
														<h2 class="title-slider">STATEMENT <br>MAKERS</h2>
														<div class="description-slider">Set off a chain reaction with statement styles that boast large profiles and embellished details.</div>
														<a class="button button-slider button-white" href="shop-grid-left.html">SHOP NOW</a>
													</div>
												</div>
											</div>
										</div>
										<div class="item slick-slide">
											<div class="item-content">
												<div class="content-image">
													<img width="1920" height="671" src="media/slider/3-2.jpg" alt="Image Slider">
												</div>
												<div class="item-info horizontal-start vertical-middle">
													<div class="content">
														<h2 class="title-slider">Oh, Hello <br>spring!</h2>
														<div class="description-slider">Set off a chain reaction with statement styles that boast large profiles and embellished details.</div>
														<a class="button button-slider button-white" href="shop-grid-left.html">SHOP NOW</a>
													</div>
												</div>		
											</div>
										</div>
										<div class="item slick-slide">
											<div class="item-content">
												<div class="content-image">
													<img width="1920" height="671" src="media/slider/3-3.jpg" alt="Image Slider">
												</div>
												<div class="item-info horizontal-start vertical-middle">
													<div class="content">
														<h2 class="title-slider">Best of <br>the Best</h2>
														<div class="description-slider">Set off a chain reaction with statement styles that boast large profiles and embellished details.</div>
														<a class="button button-slider button-white" href="shop-grid-left.html">SHOP NOW</a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding m-b-70">
								<div class="section-container">
									<!-- Block Product Categories (Layout 2) -->
									<div class="block block-product-cats layout-2">
										<div class="block-widget-wrap">
											<div class="row">
												<div class="col-lg-3 col-md-6">
													<div class="item item-product-cat">
														<div class="item-product-cat-content">
															<div class="item-image animation-horizontal">
																<a href="shop-grid-left.html">
																	<img width="330" height="330" src="media/product/cat-3-1.jpg" alt="Bracelets">
																</a>
															</div>
															<div class="product-cat-content-info">
																<a class="item-title" href="shop-grid-left.html">Bracelets</a>
															</div>
														</div>
													</div>
												</div>
												<div class="col-lg-3 col-md-6">
													<div class="item item-product-cat">
														<div class="item-product-cat-content">
															<div class="item-image animation-horizontal">
																<a href="shop-grid-left.html">
																	<img width="330" height="330" src="media/product/cat-3-2.jpg" alt="Earrings">
																</a>
															</div>
															<div class="product-cat-content-info">
																<a class="item-title" href="shop-grid-left.html">Earrings</a>
															</div>
														</div>
													</div>
												</div>
												<div class="col-lg-3 col-md-6">
													<div class="item item-product-cat">
														<div class="item-product-cat-content">
															<div class="item-image animation-horizontal">
																<a href="shop-grid-left.html">
																	<img width="330" height="330" src="media/product/cat-3-3.jpg" alt="Necklaces">
																</a>
															</div>
															<div class="product-cat-content-info">
																<a class="item-title" href="shop-grid-left.html">Necklaces</a>
															</div>
														</div>
													</div>
												</div>
												<div class="col-lg-3 col-md-6">
													<div class="item item-product-cat">
														<div class="item-product-cat-content">
															<div class="item-image animation-horizontal">
																<a href="shop-grid-left.html">
																	<img width="330" height="330" src="media/product/cat-3-4.jpg" alt="Rings">
																</a>
															</div>
															<div class="product-cat-content-info">
																<a class="item-title" href="shop-grid-left.html">Rings</a>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding m-b-80">
								<div class="section-container">
									<!-- Block Lookbook -->
									<div class="block block-lookbook">
										<div class="block-widget-wrap">
											<div class="lookbook-item">
												<div class="row">
													<div class="col-md-6 col-image">
														<div class="lookbook-container">
															<div class="lookbook-content">
																<div class="item">
																	<img width="690" height="473" src="media/banner/lookbook-3-1.jpg" alt="Look Book 1">
																	<div class="item-lookbook" style="left:43%; top:77%">
																		<span class="number-lookbook">1</span>
																		<div class="content-lookbook" style="left:35px; bottom:10px;">
																			<div class="item-thumb">
																				<a href="shop-details.html">
																					<img width="1000" height="1000" src="media/product/1.jpg" alt="">
																				</a>
																			</div>
																			<div class="content-lookbook-bottom">
																				<div class="item-title">
																					<a href="shop-details.html">Medium Flat Hoops</a>
																				</div>
																				<span class="price">
																					<del aria-hidden="true"><span>$150.00</span></del> 
																					<ins><span>$100.00</span></ins>
																				</span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div class="col-md-6 col-text">
														<div class="lookbook-intro-wrap position-center text-center">
															<div class="lookbook-intro">
																<h2 class="title">Curated by color</h2>
																<div class="description">Brighten up your look with vibrant gemstone jewelry.</div>
																<a href="shop-grid-left.html" class="button button-primary animation-horizontal">SHOP NOW</a>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="lookbook-item">
												<div class="row">
													<div class="col-md-6 col-text">
														<div class="lookbook-intro-wrap position-center text-center">
															<div class="lookbook-intro">
																<h2 class="title">Make the connection</h2>
																<div class="description">Introducing your outfit’s missing link.</div>
																<a href="shop-grid-left.html" class="button button-primary animation-horizontal">SHOP NOW</a>
															</div>
														</div>
													</div>
													<div class="col-md-6 col-image">
														<div class="lookbook-container">
															<div class="lookbook-content">
																<div class="item">
																	<img width="690" height="473" src="media/banner/lookbook-3-2.jpg" alt="Look Book 1">
																	<div class="item-lookbook" style="right:25%; top:50%">
																		<span class="number-lookbook">1</span>
																		<div class="content-lookbook" style="right:35px; bottom:10px;">
																			<div class="item-thumb">
																				<a href="shop-details.html">
																					<img width="1000" height="1000" src="media/product/3.jpg" alt="">
																				</a>
																			</div>
																			<div class="content-lookbook-bottom">
																				<div class="item-title">
																					<a href="shop-details.html">Twin Hoops</a>
																				</div>
																				<span class="price">
																					<del aria-hidden="true"><span>$150.00</span></del> 
																					<ins><span>$100.00</span></ins>
																				</span>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding background-img bg-img-3 p-t-60 p-b-70 m-b-70">
								<div class="section-container">
									<!-- Block Products (Layout 2) -->
									<div class="block block-products layout-2 slider">
										<div class="block-widget-wrap">
											<div class="block-title"><h2>Trending Products</h2></div>
											<div class="block-content">
												<div class="content-product-list slick-wrap">
													<div class="slick-sliders products-list grid" data-slidestoscroll="true" data-dots="false" data-nav="1" data-columns4="1" data-columns3="2" data-columns2="2" data-columns1="3" data-columns1440="4" data-columns="4">
														<div class="item-product slick-slide">
															<div class="items">
																<div class="products-entry clearfix product-wapper">
																	<div class="products-thumb">
																		<div class="product-lable">
																			<div class="hot">Hot</div>
																		</div>
																		<div class="product-thumb-hover">
																			<a href="shop-details.html">
																				<img width="600" height="600" src="media/product/6.jpg" class="post-image" alt="">
																				<img width="600" height="600" src="media/product/6-2.jpg" class="hover-image back" alt="">
																			</a>
																		</div>		
																		<div class="product-button">
																			<div class="btn-add-to-cart" data-title="Add to cart">
																				<a rel="nofollow" href="#" class="product-btn button">Add to cart</a>
																			</div>
																			<div class="btn-wishlist" data-title="Wishlist">
																				<button class="product-btn">Add to wishlist</button>
																			</div>
																			<div class="btn-compare" data-title="Compare">
																				<button class="product-btn">Compare</button>
																			</div>
																			<span class="product-quickview" data-title="Quick View">
																				<a href="#" class="quickview quickview-button">Quick View <i class="icon-search"></i></a>
																			</span>		
																		</div>
																	</div>
																	<div class="products-content">
																		<div class="contents">
																			<div class="rating">
																				<div class="star star-0"></div><span class="count">(0 review)</span>
																			</div>
																			<h3 class="product-title"><a href="shop-details.html">Medium Flat Hoops</a></h3>
																			<span class="price">$100.00</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														<div class="item-product slick-slide">
															<div class="items">
																<div class="products-entry clearfix product-wapper">
																	<div class="products-thumb">
																		<div class="product-lable">
																			<div class="onsale">-10%</div>
																			<div class="hot">Hot</div>
																		</div>
																		<div class="product-thumb-hover">
																			<a href="shop-details.html">
																				<img width="600" height="600" src="media/product/7.jpg" class="post-image" alt="">
																				<img width="600" height="600" src="media/product/7-2.jpg" class="hover-image back" alt="">
																			</a>
																		</div>		
																		<div class="product-button">
																			<div class="btn-add-to-cart" data-title="Add to cart">
																				<a rel="nofollow" href="#" class="product-btn button">Add to cart</a>
																			</div>
																			<div class="btn-wishlist" data-title="Wishlist">
																				<button class="product-btn">Add to wishlist</button>
																			</div>
																			<div class="btn-compare" data-title="Compare">
																				<button class="product-btn">Compare</button>
																			</div>
																			<span class="product-quickview" data-title="Quick View">
																				<a href="#" class="quickview quickview-button">Quick View <i class="icon-search"></i></a>
																			</span>		
																		</div>
																	</div>
																	<div class="products-content">
																		<div class="contents">
																			<div class="rating">
																				<div class="star star-5"></div><span class="count">(1 review)</span>
																			</div>
																			<h3 class="product-title"><a href="shop-details.html">Bold Pearl Hoop Earrings</a></h3>
																			<span class="price">
																				<del aria-hidden="true"><span>$200.00</span></del>
																				<ins><span>$180.00</span></ins>
																			</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														<div class="item-product slick-slide">
															<div class="items">
																<div class="products-entry clearfix product-wapper">
																	<div class="products-thumb">
																		<div class="product-lable">
																			<div class="hot">Hot</div>
																		</div>
																		<div class="product-thumb-hover">
																			<a href="shop-details.html">
																				<img width="600" height="600" src="media/product/9.jpg" class="post-image" alt="">
																				<img width="600" height="600" src="media/product/9-2.jpg" class="hover-image back" alt="">
																			</a>
																		</div>		
																		<div class="product-button">
																			<div class="btn-add-to-cart" data-title="Add to cart">
																				<a rel="nofollow" href="#" class="product-btn button">Add to cart</a>
																			</div>
																			<div class="btn-wishlist" data-title="Wishlist">
																				<button class="product-btn">Add to wishlist</button>
																			</div>
																			<div class="btn-compare" data-title="Compare">
																				<button class="product-btn">Compare</button>
																			</div>
																			<span class="product-quickview" data-title="Quick View">
																				<a href="#" class="quickview quickview-button">Quick View <i class="icon-search"></i></a>
																			</span>		
																		</div>
																	</div>
																	<div class="products-content">
																		<div class="contents">
																			<div class="rating">
																				<div class="star star-0"></div><span class="count">(0 review)</span>
																			</div>
																			<h3 class="product-title"><a href="shop-details.html">Twin Hoops</a></h3>
																			<span class="price">$150.00</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														<div class="item-product slick-slide">
															<div class="items">
																<div class="products-entry clearfix product-wapper">
																	<div class="products-thumb">
																		<div class="product-lable">
																			<div class="onsale">-33%</div>
																		</div>
																		<div class="product-thumb-hover">
																			<a href="shop-details.html">
																				<img width="600" height="600" src="media/product/10.jpg" class="post-image" alt="">
																				<img width="600" height="600" src="media/product/10-2.jpg" class="hover-image back" alt="">
																			</a>
																		</div>		
																		<div class="product-button">
																			<div class="btn-add-to-cart" data-title="Add to cart">
																				<a rel="nofollow" href="#" class="product-btn button">Add to cart</a>
																			</div>
																			<div class="btn-wishlist" data-title="Wishlist">
																				<button class="product-btn">Add to wishlist</button>
																			</div>
																			<div class="btn-compare" data-title="Compare">
																				<button class="product-btn">Compare</button>
																			</div>
																			<span class="product-quickview" data-title="Quick View">
																				<a href="#" class="quickview quickview-button">Quick View <i class="icon-search"></i></a>
																			</span>		
																		</div>
																	</div>
																	<div class="products-content">
																		<div class="contents">
																			<div class="rating">
																				<div class="star star-4"></div><span class="count">(2 reviews)</span>
																			</div>
																			<h3 class="product-title"><a href="shop-details.html">Yilver And Turquoise Earrings</a></h3>
																			<span class="price">
																				<del aria-hidden="true"><span>$150.00</span></del> 
																				<ins><span>$100.00</span></ins>
																			</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
														<div class="item-product slick-slide">
															<div class="items">
																<div class="products-entry clearfix product-wapper">
																	<div class="products-thumb">
																		<div class="product-lable">
																			<div class="onsale">-7%</div>
																		</div>
																		<div class="product-thumb-hover">
																			<a href="shop-details.html">
																				<img width="600" height="600" src="media/product/11.jpg" class="post-image" alt="">
																				<img width="600" height="600" src="media/product/11-2.jpg" class="hover-image back" alt="">
																			</a>
																		</div>
																		<div class="product-button">
																			<div class="btn-add-to-cart" data-title="Add to cart">
																				<a rel="nofollow" href="#" class="product-btn button">Add to cart</a>
																			</div>
																			<div class="btn-wishlist" data-title="Wishlist">
																				<button class="product-btn">Add to wishlist</button>
																			</div>
																			<div class="btn-compare" data-title="Compare">
																				<button class="product-btn">Compare</button>
																			</div>
																			<span class="product-quickview" data-title="Quick View">
																				<a href="#" class="quickview quickview-button">Quick View <i class="icon-search"></i></a>
																			</span>		
																		</div>
																		<div class="product-stock">    
																			<span class="stock">Out Of Stock</span>
																		</div>
																	</div>
																	<div class="products-content">
																		<div class="contents">
																			<div class="rating">
																				<div class="star star-5"></div><span class="count">(1 review)</span>
																			</div>
																			<h3 class="product-title"><a href="shop-details.html">Medium Flat Hoops</a></h3>
																			<span class="price">
																				<del aria-hidden="true"><span>$150.00</span></del> 
																				<ins><span>$140.00</span></ins>
																			</span>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding m-b-70">
								<div class="section-container">
									<!-- Block Intro (Layout 3) -->
									<div class="block block-intro layout-3">
										<div class="block-widget-wrap">
											<div class="row">
												<div class="section-column left">
													<div class="intro-wrap">
														<h2 class="intro-title">It started with love</h2>
														<div class="intro-item">
															Behind our 15-year success is our panel of expert jewellers who have been scouring the entire globe in pursuit of the best and most stunning jewellery that can be offered at affordable price for you. 
														</div>
														<div class="intro-item">
															Visit our online catalogue and shop for the finest earrings, rings, bracelets, watches, silver, and the most luxurious gemstones. 
														</div>
														<div class="intro-btn">
															<a href="page-about.html" class="button button-primary animation-horizontal">About Us</a>
														</div>
													</div>
												</div>
												<div class="section-column right animation-horizontal hover-opacity">
													<img width="690" height="498" src="media/banner/intro-3.jpg" alt="intro">
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding background-img bg-img-4 p-t-60 p-b-80">
								<!-- Block Instagram -->
								<div class="block block-instagram slider">
									<div class="block-widget-wrap">
										<div class="block-title">
											<div class="title-icon animation-horizontal"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M437.019,74.981C388.667,26.628,324.379,0,256,0S123.333,26.628,74.981,74.981C26.628,123.333,0,187.621,0,256    s26.628,132.667,74.981,181.019C123.333,485.372,187.621,512,256,512s132.667-26.628,181.019-74.981S512,324.379,512,256    S485.372,123.333,437.019,74.981z M256,495.832C123.756,495.832,16.168,388.244,16.168,256S123.756,16.168,256,16.168    S495.832,123.756,495.832,256S388.244,495.832,256,495.832z"></path></g></g><g><g><path d="M347.845,97.011H164.155c-37.024,0-67.144,30.121-67.144,67.144v183.692c0,37.022,30.121,67.143,67.144,67.143h183.692    c37.022,0,67.143-30.121,67.143-67.144V164.155C414.989,127.131,384.869,97.011,347.845,97.011z M398.821,347.845    c0,28.108-22.868,50.976-50.976,50.976H164.155c-28.108,0-50.976-22.868-50.976-50.976V164.155    c0-28.108,22.868-50.976,50.976-50.976h183.692c28.107,0,50.975,22.868,50.975,50.976V347.845z"></path></g></g><g><g><path d="M339.402,251.22c-2.391-42.533-37.002-76.75-79.558-78.669c-49.108-2.214-89.535,38.232-87.292,87.346    c1.945,42.56,36.19,77.154,78.728,79.51c17.951,0.995,34.762-3.727,48.803-12.494c4.374-2.731,5.087-8.814,1.441-12.459    c-0.039-0.039-0.077-0.077-0.115-0.115c-2.657-2.658-6.778-3.059-9.971-1.075c-10.491,6.519-22.892,10.241-36.158,10.102    c-37.455-0.394-67.676-31.844-66.621-69.286c1.061-37.681,33.215-67.721,71.657-65.312c33.126,2.076,60.09,28.49,62.819,61.569    c1.111,13.475-1.787,26.206-7.61,37.157c-1.667,3.136-1.153,6.982,1.358,9.493c0.041,0.041,0.083,0.083,0.124,0.124    c3.773,3.773,10.154,2.886,12.675-1.816C336.664,282.269,340.301,267.197,339.402,251.22z"></path></g></g><g><g><circle cx="342.232" cy="158.989" r="21.558"></circle></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>
											<h2>Mojuri instagram</h2>
										</div>
										<div class="block-content">
											<div class="slick-wrap">
												<div class="slick-sliders" data-dots="false" data-item_row="1" data-nav="false" data-columns4="1" data-columns3="2" data-columns2="3" data-columns1="4" data-columns="4">
													<div class="item slick-slide">
														<a class="instagram" href="#">
															<img width="450" height="450" src="media/banner/instagram-1.jpg" alt="Image Slider">
														</a>
													</div>
													<div class="item slick-slide">
														<a class="instagram" href="#">
															<img width="450" height="450" src="media/banner/instagram-2.jpg" alt="Image Slider">
														</a>
													</div>
													<div class="item slick-slide">
														<a class="instagram" href="#">
															<img width="450" height="450" src="media/banner/instagram-3.jpg" alt="Image Slider">
														</a>
													</div>
													<div class="item slick-slide">
														<a class="instagram" href="#">
															<img width="450" height="450" src="media/banner/instagram-4.jpg" alt="Image Slider">
														</a>
													</div>
													<div class="item slick-slide">
														<a class="instagram" href="#">
															<img width="450" height="450" src="media/banner/instagram-5.jpg" alt="Image Slider">
														</a>
													</div>
													<div class="item slick-slide">
														<a class="instagram" href="#">
															<img width="450" height="450" src="media/banner/instagram-6.jpg" alt="Image Slider">
														</a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding m-b-70">
								<div class="section-container">
									<!-- Block Newsletter (Layout 2) -->
									<div class="block block-newsletter layout-2 one-col">
										<div class="block-widget-wrap">
											<div class="newsletter-title-wrap">
												<h2 class="newsletter-title">Latest From MoJuri!</h2>
												<div class="newsletter-text">Sign-up to receive 10% off your next purchase. Plus hear about new arrivals and offers.</div>
											</div>
											<form action="" method="post" class="newsletter-form">
												<input type="email" name="your-email" value="" size="40" placeholder="Email address">
												<span class="btn-submit">
													<input type="submit" value="SUBSCRIBE">
												</span>
											</form>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding background-img bg-img-5 p-t-120 p-b-120 m-b-0">
								<div class="section-container">
									<!-- Block Info -->
									<div class="block block-info">
										<div class="block-widget-wrap">
											<div class="info-wrap">
												<div class="icon animation-horizontal"><svg viewBox="0 0 512 512" width="512" height="512"><g><circle cx="256" cy="196" r="10"></circle><path d="m181 296h150c5.522 0 10-4.477 10-10v-93.972l13.493 11.566c4.21 3.609 10.521 3.09 14.1-1.086 3.594-4.193 3.108-10.506-1.086-14.101l-104.999-89.999c-3.744-3.21-9.271-3.21-13.016 0l-104.999 89.999c-4.194 3.594-4.68 9.907-1.086 14.101 3.593 4.194 9.907 4.679 14.1 1.086l13.493-11.566v93.972c0 5.523 4.478 10 10 10zm10-121.115 65-55.714 65 55.714v101.115h-55v-40c0-5.523-4.478-10-10-10s-10 4.477-10 10v40h-55z"></path><path d="m248.814 508.954c1.884 1.947 4.477 3.046 7.186 3.046s5.302-1.099 7.186-3.046c63.824-65.879 182.814-214.083 182.814-312.954 0-34.896-9.487-69.49-27.438-100.042-2.799-4.762-8.926-6.354-13.688-3.557-4.762 2.798-6.354 8.926-3.557 13.688 16.148 27.484 24.683 58.575 24.683 89.911 0 101.169-136.787 255.428-170 291.384-33.213-35.956-170-190.215-170-291.384 0-95.402 77.851-176 170-176 30.377 0 60.33 8.741 86.62 25.279 4.673 2.941 10.849 1.535 13.789-3.14s1.534-10.849-3.141-13.789c-29.483-18.547-63.118-28.35-97.268-28.35-106.552 0-190 92.76-190 196 0 98.768 118.792 246.87 182.814 312.954z"></path><circle cx="383" cy="65" r="10"></circle></g></svg></div>
												<h2 class="title">Visit Our Store</h2>
												<ul>
												   <li>Rains HQ, Jens Olsens Vej 13 ,8200 Aarhus N, Denmark</li>
												   <li>Email : sayhello@sienastore.com</li>
												   <li>Phone : (+45) 7199 2516</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</section>

							<section class="section section-padding p-t-10 p-b-10 m-b-0">
								<div class="section-container">
									<!-- Block Image -->
									<div class="block block-image slider">
										<div class="block-widget-wrap">
											<div class="slick-wrap">
												<div class="slick-sliders" data-nav="0" data-columns4="1" data-columns3="2" data-columns2="3" data-columns1="4" data-columns1440="5" data-columns="5">
													<div class="item slick-slide">
														<div class="item-image animation-horizontal">
															<a href="#"> 
																<img width="450" height="450" src="media/brand/1.jpg" alt="Brand 1">
															</a>
														</div>
													</div>
													<div class="item slick-slide">
														<div class="item-image animation-horizontal">
															<a href="#"> 
																<img width="450" height="450" src="media/brand/2.jpg" alt="Brand 2">
															</a>
														</div>
													</div>
													<div class="item slick-slide">
														<div class="item-image animation-horizontal">
															<a href="#"> 
																<img width="450" height="450" src="media/brand/3.jpg" alt="Brand 3">
															</a>
														</div>
													</div>
													<div class="item slick-slide">
														<div class="item-image animation-horizontal">
															<a href="#"> 
																<img width="450" height="450" src="media/brand/4.jpg" alt="Brand 4">
															</a>
														</div>
													</div>
													<div class="item slick-slide">
														<div class="item-image animation-horizontal">
															<a href="#"> 
																<img width="450" height="450" src="media/brand/5.jpg" alt="Brand 5">
															</a>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>
						</div><!-- #content -->
					</div><!-- #primary -->
				</div><!-- #main-content -->
			</div>

			<footer id="site-footer" class="site-footer three-columns">
				<div class="footer">
					<div class="section-padding">
						<div class="section-container">
							<div class="block-widget-wrap">
								<div class="row">
									<div class="col-lg-4 column-left">
										<div class="column-wrap">
											<div class="block block-newsletter">
												<h2 class="block-title">Our Newsletter</h2>
												<div class="block-content">
													<div class="newsletter-text">Sign up for the latest Ice offers and exclusives.</div>
													<form action="" method="post" class="newsletter-form">
														<input type="email" name="your-email" value="" size="40" placeholder="Email address">
														<span class="btn-submit">
															<input type="submit" value="Subscribe">
														</span>
													</form>
												</div>
											</div>
											<div class="block block-image">
												<img width="309" height="32" src="media/payments.png" alt="">
											</div>
										</div>
									</div>
									<div class="col-lg-4 column-center">
										<div class="column-wrap">
											<div class="block block-image m-b-20">
												<img width="100" src="media/logo.png" alt="">
											</div>
											<div class="block block-social">
												<ul class="social-link">
													<li><a href="#"><i class="fa fa-twitter"></i></a></li>
													<li><a href="#"><i class="fa fa-instagram"></i></a></li>
													<li><a href="#"><i class="fa fa-dribbble"></i></a></li>
													<li><a href="#"><i class="fa fa-behance"></i></a></li>
												</ul>
											</div>
										</div>
									</div>
									<div class="col-lg-4 column-right">
										<div class="column-wrap">
											<div class="row">
												<div class="col-lg-6 md-b-20">
													<div class="block block-menu">
														<h2 class="block-title">Customer Services</h2>
														<div class="block-content">
															<ul>
																<li>
																	<a href="#">Contact Us</a>
																</li>
																<li>
																	<a href="#">Track Your Order</a>
																</li>
																<li>
																	<a href="#">Product Care & Repair</a>
																</li>
																<li>
																	<a href="#">Book an Appointment</a>
																</li>
																<li>
																	<a href="#">Frequently Asked Questions</a>
																</li>
																<li>
																	<a href="#">Shipping & Returns</a>
																</li>
															</ul>
														</div>
													</div>
												</div>
												<div class="col-lg-6">
													<div class="block block-menu">
														<h2 class="block-title">About Us</h2>
														<div class="block-content">
															<ul>
																<li>
																	<a href="#">About Us</a>
																</li>
																<li>
																	<a href="#">FAQ</a>
																</li>
																<li>
																	<a href="#">Our Producers</a>
																</li>
																<li>
																	<a href="#">Sitemap</a>
																</li>
																<li>
																	<a href="#">Terms & Conditions</a>
																</li>
																<li>
																	<a href="#">Privacy Policy</a>
																</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="footer-bottom">
					<div class="section-padding">
						<div class="section-container">
							<div class="block-widget-wrap">
								<p class="copyright text-center">Copyright © 2023. All Right Reserved</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>

		<!-- Back Top button -->
		<div class="back-top button-show">
			<i class="arrow_carrot-up"></i>
		</div>

		<!-- Search -->
		<div class="search-overlay">
			<div class="close-search"></div>
			<div class="wrapper-search">
				<form role="search" method="get" class="search-from ajax-search" action="">
					<a href="#" class="search-close"></a>
					<div class="search-box">
						<button id="searchsubmit" class="btn" type="submit">
							<i class="icon-search"></i>
						</button>
						<input type="text" autocomplete="off" value="" name="s" class="input-search s" placeholder="Search...">
						<div class="content-menu_search">
							<label>Suggested</label>
							<ul id="menu_search" class="menu">
								<li><a href="#">Earrings</a></li>
								<li><a href="#">Necklaces</a></li>
								<li><a href="#">Bracelets</a></li>
								<li><a href="#">Jewelry Box</a></li>
							</ul>			
						</div>
					</div>
				</form>	
			</div>	
		</div>

		<!-- Wishlist -->
		<div class="wishlist-popup">
			<div class="wishlist-popup-inner">
                <div class="wishlist-popup-content">
                    <div class="wishlist-popup-content-top">
                        <span class="wishlist-name">Wishlist</span>
						<span class="wishlist-count-wrapper"><span class="wishlist-count">2</span></span>                                
						<span class="wishlist-popup-close"></span>
                    </div>
                    <div class="wishlist-popup-content-mid">
						<table class="wishlist-items">                        
							<tbody>
								<tr class="wishlist-item">
									<td class="wishlist-item-remove"><span></span></td>
									<td class="wishlist-item-image">
                                    	<a href="shop-details.html">
											<img width="600" height="600" src="media/product/3.jpg" alt="">                                        
										</a>
		                       		</td>
			                        <td class="wishlist-item-info">
										<div class="wishlist-item-name">
											<a href="shop-details.html">Twin Hoops</a>
										</div>
										<div class="wishlist-item-price">
											<span>$150.00</span>
										</div>
										<div class="wishlist-item-time">June 4, 2022</div>                                
									</td>
			                        <td class="wishlist-item-actions">
			                            <div class="wishlist-item-stock">
											In stock 
										</div>
			                            <div class="wishlist-item-add">
											<div data-title="Add to cart">
												<a rel="nofollow" href="#">Add to cart</a>
											</div>
										</div>
	                                </td>
								</tr>
								<tr class="wishlist-item">
									<td class="wishlist-item-remove"><span></span></td>
									<td class="wishlist-item-image">
                                    	<a href="shop-details.html">
											<img width="600" height="600" src="media/product/4.jpg" alt="">                                        
										</a>
		                       		</td>
			                        <td class="wishlist-item-info">
										<div class="wishlist-item-name">
											<a href="shop-details.html">Yilver And Turquoise Earrings</a>
										</div>
										<div class="wishlist-item-price">
											<del aria-hidden="true"><span>$150.00</span></del> 
											<ins><span>$100.00</span></ins>
										</div>
										<div class="wishlist-item-time">June 4, 2022</div>                                
									</td>
			                        <td class="wishlist-item-actions">
			                            <div class="wishlist-item-stock">
											In stock 
										</div>
			                            <div class="wishlist-item-add">
											<div data-title="Add to cart">
												<a rel="nofollow" href="#">Add to cart</a>
											</div>
										</div>
	                                </td>
								</tr>
							</tbody>
						</table>
					</div>
                    <div class="wishlist-popup-content-bot">
                        <div class="wishlist-popup-content-bot-inner">
                            <a class="wishlist-page" href="shop-wishlist.html">
								Open wishlist page                                    
							</a>
                            <span class="wishlist-continue" data-url="">
                                Continue shopping                                        
                            </span>
                        </div>
                        <div class="wishlist-notice wishlist-notice-show">Added to the wishlist!</div>
                    </div>
                </div>
            </div>
		</div>

		<!-- Compare -->
		<div class="compare-popup">
		    <div class="compare-popup-inner">
		        <div class="compare-table">
		            <div class="compare-table-inner">
                    	<a href="#" id="compare-table-close" class="compare-table-close">
                    		<span class="compare-table-close-icon"></span>
                    	</a>
                    	<div class="compare-table-items">
                    		<table id="product-table" class="product-table">
                    			<thead>
                    				<tr>
                    					<th>
                    						<a href="#" class="compare-table-settings">Settings</a>
                    					</th>
                    					<th>
                    						<a href="shop-details.html">Twin Hoops</a> <span class="remove">remove</span>
                    					</th>
                    					<th>
                    						<a href="shop-details.html">Medium Flat Hoops</a> <span class="remove">remove</span>
                    					</th>
                    					<th>
                    						<a href="shop-details.html">Bold Pearl Hoop Earrings</a> <span class="remove">remove</span>
                    					</th>
                    				</tr>
                    			</thead>
                    			<tbody>
                    				<tr class="tr-image">
                    					<td class="td-label">Image</td>
                    					<td>
                    						<a href="shop-details.html">
                    							<img width="600" height="600" src="media/product/3.jpg" alt="">
                    						</a>
                    					</td>
                    					<td>
                    						<a href="shop-details.html">
                    							<img width="600" height="600" src="media/product/1.jpg" alt="">
                    						</a>
                    					</td>
                    					<td>
                    						<a href="shop-details.html">
                    							<img width="600" height="600" src="media/product/2.jpg" alt="">
                    						</a>
                    					</td>
                    				</tr>
                    				<tr class="tr-sku">
                    					<td class="td-label">SKU</td>
                    					<td>VN00189</td>
                    					<td></td>
                    					<td>D1116</td>
                    				</tr>
                    				<tr class="tr-rating">
                    					<td class="td-label">Rating</td>
                    					<td>
                    						<div class="star-rating">
                    							<span style="width:80%"></span>
                    						</div>
                    					</td>
                    					<td>
                    						<div class="star-rating">
                    							<span style="width:100%"></span>
                    						</div>
                    					</td>
                    					<td></td>
                    				</tr>
                    				<tr class="tr-price">
                    					<td class="td-label">Price</td>
                    					<td><span class="amount">$150.00</span></td>
                    					<td><del><span class="amount">$150.00</span></del> <ins><span class="amount">$100.00</span></ins></td>
                    					<td><span class="amount">$200.00</span></td>
                    				</tr>
                    				<tr class="tr-add-to-cart">
                    					<td class="td-label">Add to cart</td>
                    					<td>
                    						<div data-title="Add to cart">
                    							<a href="#" class="button">Add to cart</a>
                    						</div>
                    					</td>
                    					<td>
                    						<div data-title="Add to cart">
                    							<a href="#" class="button">Add to cart</a>
                    						</div>
                    					</td>
                    					<td>
                    						<div data-title="Add to cart">
                    							<a href="#" class="button">Add to cart</a>
                    						</div>
                    					</td>
                    				</tr>
                    				<tr class="tr-description">
                    					<td class="td-label">Description</td>
                    					<td>Phasellus sed volutpat orci. Fusce eget lore mauris vehicula elementum gravida nec dui. Aenean aliquam varius ipsum, non ultricies tellus sodales eu. Donec dignissim viverra nunc, ut aliquet magna posuere eget.</td>
                    					<td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</td>
                    					<td>The EcoSmart Fleece Hoodie full-zip hooded jacket provides medium weight fleece comfort all year around. Feel better in this sweatshirt because Hanes keeps plastic bottles of landfills by using recycled polyester.7.8 ounce fleece sweatshirt made with up to 5 percent polyester created from recycled plastic.</td>
                    				</tr>
                    				<tr class="tr-content">
                    					<td class="td-label">Content</td>
                    					<td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</td>
                    					<td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</td>
                    					<td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</td>
                    				</tr>
                    				<tr class="tr-dimensions">
                    					<td class="td-label">Dimensions</td>
                    					<td>N/A</td>
                    					<td>N/A</td>
                    					<td>N/A</td>
                    				</tr>
                    			</tbody>
                    		</table>
                    	</div>
		            </div>
		        </div>
		    </div>
		</div>

		<!-- Quickview -->
		<div class="quickview-popup">
			<div id="quickview-container"> 
				<div class="quickview-container"> 
					<a href="#" class="quickview-close"></a> 
					<div class="quickview-notices-wrapper"></div> 
					<div class="product single-product product-type-simple">
						<div class="product-detail">
							<div class="row"> 
								<div class="img-quickview"> 
									<div class="product-images-slider">
										<div id="quickview-slick-carousel"> 
											<div class="images"> 
												<div class="scroll-image">
													<div class="slick-wrap">
														<div class="slick-sliders image-additional" data-dots="true" data-columns4="1" data-columns3="1" data-columns2="1" data-columns1="1" data-columns="1" data-nav="true">
															<div class="img-thumbnail slick-slide"> 
																<a href="media/product/3.jpg" class="image-scroll" title="">
																	<img width="900" height="900" src="media/product/3.jpg" alt="">
																</a> 
															</div>
															<div class="img-thumbnail slick-slide"> 
																<a href="media/product/3-2.jpg" class="image-scroll" title="">
																	<img width="900" height="900" src="media/product/3-2.jpg" alt="">
																</a> 
															</div>
														</div>
													</div>
												</div> 
											</div> 
										</div> 
									</div> 
								</div> 
								<div class="quickview-single-info">
									<div class="product-content-detail entry-summary">
										<h1 class="product-title entry-title">Twin Hoops</h1>
										<div class="price-single">
											<div class="price">
												<del><span>$150.00</span></del>
												<span>$100.00</span>
											</div>
										</div>
										<div class="product-rating"> 
											<div class="star-rating" role="img" aria-label="Rated 4.00 out of 5">
												<span style="width:80%">Rated <strong class="rating">4.00</strong> out of 5 based on <span class="rating">1</span> customer rating</span>
											</div> 
											<a href="#" class="review-link">(<span class="count">1</span> customer review)</a> 
										</div>
										<div class="description"> 
											<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis…</p> 
										</div>
										<form class="cart" method="post" enctype="multipart/form-data">
											<div class="quantity-button">
												<div class="quantity"> 
													<button type="button" class="plus">+</button> 
													<input type="number" class="input-text qty text" step="1" min="1" max="" name="quantity" value="1" title="Qty" size="4" placeholder="" inputmode="numeric" autocomplete="off"> 
													<button type="button" class="minus">-</button> 
												</div> 
												<button type="submit" class="single-add-to-cart-button button alt">Add to cart</button> 
											</div> 
											<button class="button quick-buy">Buy It Now</button>
										</form> 
									</div> 
								</div> 
							</div> 
						</div>
					</div> 
					<div class="clearfix"></div> 
				</div> 
			</div>
		</div>

		<!-- Newsletter Popup -->
		<div class="popup-shadow"></div>
		<div class="newsletter-popup">
			<a href="#" class="newsletter-close"></a>
			<div class="newsletter-container"> 
				<div class="newsletter-img">
					<img src="media/banner/newsletter-popup.jpg" alt="">
				</div> 
				<div class="newsletter-form">
					<form action="" method="post">
						<div class="newsletter-title">
							<div class="title">Get<br> free shipping</div>
							<div class="sub-title">on your first order. Offer ends soon.</div>
						</div>
						<div class="newsletter-input clearfix">
							<input type="email" name="your-email" size="40" class="form-control" placeholder="Enter Your Email ...">
							<input type="submit" value="Subscribe" class="form-control">
			     		</div>
			     		<div class="newsletter-no">no thanks !</div>
					</form>
				</div> 
			</div>
		</div>

		<!-- Page Loader -->
		<div class="page-preloader">
	    	<div class="loader">
	    		<div></div>
	    		<div></div>
	    	</div>
	    </div>

		<!-- Dependency Scripts -->
		
		
		
		
		
		
		<!-- Site Scripts -->
		
	`;

export default function Page_index3() {
  const ref = useRef<HTMLDivElement>(null);
  usePageScripts(ref, 'Home Minimal | Mojuri');
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: HTML }} />;
}

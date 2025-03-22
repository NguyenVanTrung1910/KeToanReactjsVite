import React, { forwardRef, HTMLAttributes, ReactNode, useEffect, useRef, useState, useContext } from 'react';
import classNames from 'classnames';
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ThemeContext from '../../contexts/themeContext';
interface IListProps extends HTMLAttributes<HTMLUListElement> {
	id?: string;
	children?: ReactNode;
	className?: string;
	ariaLabelledby?: string;
	parentId?: string;
	rootId?: string;
	horizontal?: boolean;
}
// const List = forwardRef<HTMLUListElement, IListProps>(
// 	({ id, children, className, ariaLabelledby, parentId, rootId, horizontal, ...props }, ref) => {
// 		const navRef = useRef<HTMLElement | null>(null);

// 		const handleScroll = (direction: "left" | "right") => {
// 			if (navRef.current) {
// 				const scrollAmount = 150;
// 				navRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
// 			}
// 		};


// 		if (horizontal) {
// 			return (
// 				<div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
// 					{/* Nút lùi */}
// 					<IconButton onClick={() => handleScroll("left")}>
// 						<ChevronLeft />
// 					</IconButton>
// 					<ul
// 					ref={ref}
// 					id={id}
// 					className={classNames('navigation', { 'navigation-menu': horizontal }, className)}
// 					aria-labelledby={ariaLabelledby}
// 					data-bs-parent={
// 						parentId === `${rootId}__${rootId}`
// 							? `#${rootId}`
// 							: (parentId && `#${parentId}`) || null
// 					}
// 					{...props}
// 					style={{overflowX: "auto", whiteSpace: "nowrap", flexGrow: 1, flexWrap: "nowrap",maxWidth:"1000px" }}
// 					>
// 					{children}

// 				</ul>
// 				<IconButton onClick={() => handleScroll("right")}>
// 						<ChevronRight />
// 					</IconButton>
// 				</div>
// 			);
// 		}

// 		return (

// 			<ul
// 				ref={ref}
// 				id={id}
// 				className={classNames('navigation', { 'navigation-menu': horizontal }, className)}
// 				aria-labelledby={ariaLabelledby}
// 				data-bs-parent={
// 					parentId === `${rootId}__${rootId}`
// 						? `#${rootId}`
// 						: (parentId && `#${parentId}`) || null
// 				}
// 				{...props}
// 				>
// 				{children}

// 			</ul>

// 		);
// 	},
// );
const List = forwardRef<HTMLUListElement, IListProps>(
	({ id, children, className, ariaLabelledby, parentId, rootId, horizontal, ...props }, ref) => {
		const navRef = useRef<HTMLUListElement | null>(null);
		const [canScrollLeft, setCanScrollLeft] = useState(false);
		const [canScrollRight, setCanScrollRight] = useState(false);
		const { tabs } = useContext(ThemeContext);

		// Kiểm tra khi nào cần ẩn/hiển thị nút
		useEffect(() => {
			const checkScroll = () => {
				if (navRef.current) {
					setCanScrollLeft(navRef.current.scrollLeft > 0);
					setCanScrollRight(
						navRef.current.scrollLeft + navRef.current.clientWidth < navRef.current.scrollWidth
					);
				}
			};

			checkScroll(); // Chạy ngay khi component render
			window.addEventListener("resize", checkScroll);
			navRef.current?.addEventListener("scroll", checkScroll);

			return () => {
				window.removeEventListener("resize", checkScroll);
				navRef.current?.removeEventListener("scroll", checkScroll);
			};
		}, [tabs]);

		// Hàm xử lý cuộn
		const handleScroll = (direction: "left" | "right") => {
			if (navRef.current) {
				const scrollAmount = 150;
				navRef.current.scrollBy({
					left: direction === "left" ? -scrollAmount : scrollAmount,
					behavior: "smooth",
				});
			}
		};

		// Nếu `horizontal = true`, hiển thị navigation với hai nút cuộn
		if (horizontal) {
			return (
				<div style={{
					display: "flex", alignItems: "center", overflow: "hidden"}}>
					{/* Nút lùi (ẩn khi không cần) */}
					
						<IconButton onClick={() => handleScroll("left")}>
							<ChevronLeft />
						</IconButton>
					

					<ul
						ref={navRef}
						id={id}
						className={classNames("navigation", { "navigation-menu": horizontal }, className)}
						aria-labelledby={ariaLabelledby}
						data-bs-parent={
							parentId === `${rootId}__${rootId}`
								? `#${rootId}`
								: (parentId && `#${parentId}`) || null
						}
						{...props}
						style={{
							overflowX: "auto",
							whiteSpace: "nowrap",
							flexGrow: 1,
							flexWrap: "nowrap",
							width:"200px",
							scrollbarWidth: "none", // Ẩn scrollbar trên Firefox
						}}
					>
						{children}
					</ul>

					{/* Nút tiến (ẩn khi không cần) */}
					{/* {canScrollRight && ( */}
						<IconButton onClick={() => handleScroll("right")}>
							<ChevronRight />
						</IconButton>
					{/* )} */}
				</div>
			);
		}

		// Trường hợp không phải horizontal, chỉ hiển thị danh sách bình thường
		return (
			<ul
				ref={ref}
				id={id}
				className={classNames("navigation", { "navigation-menu": horizontal }, className)}
				aria-labelledby={ariaLabelledby}
				data-bs-parent={
					parentId === `${rootId}__${rootId}`
						? `#${rootId}`
						: (parentId && `#${parentId}`) || null
				}
				{...props}
			>
				{children}
			</ul>
		);
	}
);


const updateParentClass = (): void => {
	document.querySelectorAll<HTMLUListElement>("ul.navigation.collapse").forEach((ul) => {
		if (ul.querySelector("ul.show")) {
			ul.classList.add("show");
		}
	});
};

interface NavigationMenuProps {
	children: React.ReactNode;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ children }) => {
	useEffect(() => {
		updateParentClass();
	}, []);

	return <nav>{children}</nav>;
};










List.displayName = 'List';

export default List;
